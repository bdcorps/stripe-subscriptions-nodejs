require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(express.static("public"));
app.engine("html", require("ejs").renderFile);

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY,
  { apiVersion: "2020-08-27" }
);

const productToPriceMap = {
  basic: process.env.PRODUCT_BASIC,
  pro: process.env.PRODUCT_PRO,
};

// needs to be saved in an external DB
const customerEmailToID = {
  "sunnyashiin@gmail.com": "cus_IEIKw9EvPTSULh",
};

app.get("/", function (req, res) {
  res.render("signin.ejs");
});

app.post("/submit", async function (req, res) {
  const { email } = req.body;
  console.log("email", email);

  const customer = customerEmailToID[email];
  let customerInfo = {};

  if (!customer) {
    console.log(`email ${email} does not exist. Making one. `);
    customerInfo = await addNewCustomer(email);
    console.log(`The ID for ${email} is ${JSON.stringify(customerInfo)}`);
  } else {
    customerInfo = await getCustomerByID(customer);
    console.log(
      `The existing ID for ${email} is ${JSON.stringify(customerInfo)}`
    );
  }
  res.render("account.ejs", {
    customerInfo,
    email,
  });
});

const getCustomerByID = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  return customer;
};

const addNewCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
    description: "New Customer",
  });

  return customer;
};

app.post("/checkout", async (req, res) => {
  let { product, customerID, email } = req.body;

  const price = productToPriceMap[product];

  console.log(product, price, email, customerID);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerID,
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      
      success_url: "https://google.com",
      cancel_url: "https://google.com",
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.post("/portal", async (req, res) => {
  let { customer } = req.body;
  console.log("customer", customer)
  var session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: "https://example.com/account",
  });
  console.log("session", session);

  res.json({url:session.url});
});

app.listen(4242, () => console.log(`Listening on port ${4242}!`));
