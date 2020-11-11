Stripe Subscriptions Billing

## Installation
- Create a new Stripe account
- Add a .env file by using the .env.example format
- Replace the `publishableKey` in `public/js/account.js` with your own from Stripe `Settings`. 

```
npm i
npm start
```

# Environmental Variables
```
STRIPE_SECRET_KEY=sk_test_51H8rImAkSQQctVkLmiefLPUxZhQdclj8BqTZuvHelgyQWum4COBNcIYP8viiH5dFBrEhM69Yt7Tc0hj8o26k9Pbs00tIYJkZvS
PRODUCT_BASIC=price_1HcIFWAkSQQctVkLizPQ2Oum
PRODUCT_PRO=price_1HdI8dAkSQQctVkLD9IeOYjS
MONGODB=mongodb://localhost:27017/users
STRIPE_WEBHOOK_SECRET=whsec_rYanPBSdQSswHjizrBz2pHAo6iYa2Ows
TRIAL_DAYS=14
```

