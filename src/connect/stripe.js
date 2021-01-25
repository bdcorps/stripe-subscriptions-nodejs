const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

const createCheckoutSession = async (customerID, price) => {
  const session = await Stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerID,
    line_items: [
      {
        price,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: process.env.TRIAL_DAYS
    },

    success_url: `${process.env.DOMAIN}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}`
  })

  return session
}

const createBillingSession = async (customer) => {
  const session = await Stripe.billingPortal.sessions.create({
    customer,
    return_url: 'https://localhost:4242'
  })
  return session
}

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id)
  return customer
}

const addNewCustomer = async (email) => {
  const customer = await Stripe.customers.create({
    email,
    description: 'New Customer'
  })

  return customer
}

const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  return event
}

module.exports = {
  getCustomerByID,
  addNewCustomer,
  createCheckoutSession,
  createBillingSession,
  createWebhook
}
