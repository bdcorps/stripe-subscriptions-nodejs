require("dotenv").config();
require("./src/connect/mongodb");
const bodyParser = require("body-parser");
const express = require("express");
const UserService = require("./src/user");
const Stripe = require("./src/connect/stripe");

const app = express();

// app.use(
//   express.json({
//     // We need the raw body to verify webhook signatures.
//     // Let's compute it only when hitting the Stripe webhook endpoint.
//     verify: function (req, res, buf) {
//       if (req.originalUrl.startsWith("/webhook")) {
//         req.rawBody = buf.toString();
//       }else{
//         next();
//       }
//     },
//   })
// );

app.use('/webhook', bodyParser.raw({type: "*/*"}))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/test', function (req, res, next) {
  console.log(`rawBody: ${req.rawBody}`)
  console.log(`parsed Body: ${JSON.stringify(req.body)}`)
  res.sendStatus(200)
})


app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);

const stripe = require("stripe");

const Stripe1 = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const productToPriceMap = {
  basic: process.env.PRODUCT_BASIC,
  pro: process.env.PRODUCT_PRO,
};

console.log("thing", productToPriceMap["basic"]);

app.post("/user", async function (req, res, next) {
  const {email, billingID} = req.body;

  try {
    const user = await UserService.addUser(email, billingID);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

app.get("/user", async function (req, res, next) {
  const {email} = req.params;
  try {
    const c = await UserService.getUserByEmail(email);
    res.json(c);
  } catch (e) {
    next(e);
  }
});

app.get("/", function (req, res) {
  res.render("signin.ejs");
});

app.post("/submit", async function (req, res) {
  const { email } = req.body;
  console.log(req.body);

  const customer = await UserService.getUserByEmail(email);
  let customerInfo = {};

  if (!customer) {
    console.log(`email ${email} does not exist. Making one. `);
    try {
      customerInfo = await Stripe.addNewCustomer(email);

      await UserService.addUser({
        email: customerInfo.email,
        billingID: customerInfo.id,
      });

      console.log(
        `A new user signed up and addded to DB. The ID for ${email} is ${JSON.stringify(
          customerInfo
        )}`
      );
    } catch (e) {
      res.json("Something went wrong");
      return;
    }
  } else {
    customerInfo = await Stripe.getCustomerByID(customer.billingID);
    console.log(
      `The existing ID for ${email} is ${JSON.stringify(customerInfo)}`
    );
  }
  res.render("account.ejs", {
    customerInfo,
    email,
  });
});

app.post("/checkout", async (req, res) => {
  let { product, customerID, email } = req.body;

  const price = productToPriceMap[product];

  try {
    console.log("a", product, price, email, customerID);
    const session = await Stripe.createCheckoutSession(customerID, price);

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/portal", async (req, res) => {
  let { customer } = req.body;
  console.log("customer", customer);

  const session = await Stripe.createBillingSession(customer);
  console.log("session", session);

  res.json({ url: session.url });
});

app.post(
  "/webhook",
  async (req, res) => {
    let event;

    console.log(req.body);
    console.log("signature is ", req.header("Stripe-Signature"));

    try {
      // event = Stripe.createWebhook(req.rawBody,
      //   req.header("Stripe-Signature"));
      event = Stripe1.webhooks.constructEvent(
        req.body, req.header("Stripe-Signature"),
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }



    // Extract the object from the event.
    const dataObject = event.data.object;

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case "customer.created":
        console.log(JSON.stringify(dataObject));
        break;
      case "invoice.paid":
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        break;
      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case "invoice.finalized":
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      case "customer.subscription.deleted":
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      case "customer.subscription.trial_will_end":
        // Send notification to your user that the trial will end
        break;
      default:
      // Unexpected event type
    }
    res.sendStatus(200);
  }
);

app.listen(4242, () => console.log(`Listening on port ${4242}!`));
