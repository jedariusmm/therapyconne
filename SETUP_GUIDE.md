# TherapyConnect - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Stripe account (get one at https://stripe.com)
- Text editor (VS Code recommended)

### 1. Install Dependencies

```bash
cd TherapyConnect_Fixed
npm install
```

### 2. Configure Stripe

#### A. Get Your Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

#### B. Create Products and Prices
1. Go to https://dashboard.stripe.com/products
2. Create three products:

**Basic Plan:**
- Name: Basic Plan
- Price: $99.99/month
- Copy the Price ID (starts with `price_`)

**Premium Plan:**
- Name: Premium Plan
- Price: $149.99/month
- Copy the Price ID

**Enterprise Plan:**
- Name: Enterprise Plan
- Price: Custom
- Copy the Price ID

#### C. Set Up Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `http://localhost:3000/api/webhook` (for local testing)
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

STRIPE_PRICE_BASIC=price_YOUR_BASIC_PRICE_ID
STRIPE_PRICE_PREMIUM=price_YOUR_PREMIUM_PRICE_ID
STRIPE_PRICE_ENTERPRISE=price_YOUR_ENTERPRISE_PRICE_ID

PORT=3000
```

### 4. Update stripe-config.js

Edit `stripe-config.js` and replace:

```javascript
publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE',
```

With your actual publishable key.

Update the price IDs in the products object:

```javascript
products: {
    basic: {
        priceId: 'price_YOUR_BASIC_PRICE_ID',
        // ...
    },
    premium: {
        priceId: 'price_YOUR_PREMIUM_PRICE_ID',
        // ...
    }
}
```

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on http://localhost:3000

### 6. Test Locally

1. Open http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Fill out the signup form
4. Use Stripe test card: `4242 4242 4242 4242`
5. Use any future expiry date and any 3-digit CVC
6. Complete the payment

### 7. Test Webhooks Locally

Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhook
```

## 🌐 Deploy to Production

### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Create Heroku app
heroku create therapyconnect-app

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=sk_live_YOUR_KEY
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY

# Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Connect your GitHub repository
2. Add environment variables in the dashboard
3. Deploy

## 🔒 Security Checklist

- [ ] Never commit `.env` file to git
- [ ] Use HTTPS in production
- [ ] Rotate API keys regularly
- [ ] Implement rate limiting
- [ ] Add user authentication (Firebase, Auth0, etc.)
- [ ] Validate webhook signatures
- [ ] Use `STRIPE_SECRET_KEY` only on backend
- [ ] Keep dependencies updated

## 📝 Customization

### Change Colors (Therapeutic Theme)
Edit `styles.css`:

```css
:root {
    --primary: #66c2a5;      /* Calming green */
    --secondary: #8dd3c7;    /* Peaceful teal */
    --accent: #a6d8c7;       /* Soft mint */
}
```

### Update Pricing
Edit `index.html` and `stripe-config.js`

### Add More Features
- User authentication (Firebase, Auth0)
- Database (MongoDB, PostgreSQL)
- Email notifications (SendGrid, Mailgun)
- Video chat (Twilio, Agora)
- Appointment scheduling (Calendly API)

## 🆘 Troubleshooting

### Stripe not loading
- Check console for errors
- Verify publishable key in `stripe-config.js`
- Ensure Stripe.js script is loaded

### Webhook not working
- Check webhook secret in `.env`
- Use Stripe CLI for local testing
- Verify endpoint URL in Stripe dashboard

### Payment not processing
- Check secret key in `.env`
- Verify price IDs match your Stripe products
- Check server logs for errors

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Support

Need help? Contact support@therapyconnect.com

---

**Happy Healing! 🧠💚**
