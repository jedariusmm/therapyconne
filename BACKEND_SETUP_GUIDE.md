# TherapyConnect Backend Setup Guide

## 🚀 Complete Integration Guide for Supabase, Firebase & Stripe

This guide will walk you through setting up the complete backend for TherapyConnect with real authentication, database storage, and payment processing.

---

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Accounts created on:
  - [Supabase](https://supabase.com) (free tier)
  - [Firebase](https://firebase.google.com) (free Spark plan)
  - [Stripe](https://stripe.com) (test mode)

---

## Part 1: Supabase Setup (Database & Backend)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization and set project details:
   - **Project name**: TherapyConnect
   - **Database password**: (save this securely)
   - **Region**: Choose closest to your users
4. Wait 2-3 minutes for project to initialize

### 1.2 Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click **Run** (this creates all 10 tables with RLS policies)

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (only for server-side, keep secret)

### 1.4 Add to Environment Variables

Edit `.env` file:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJ...your_anon_key
SUPABASE_SERVICE_KEY=eyJhbGciOiJ...your_service_key
```

Also update `config/supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJ...';
```

---

## Part 2: Firebase Setup (Authentication)

### 2.1 Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project**
3. Enter project name: **TherapyConnect**
4. Disable Google Analytics (optional)
5. Click **Create Project**

### 2.2 Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable these providers:
   - **Email/Password** → Click Enable → Save
   - **Google** → Click Enable → Configure OAuth screen → Save

### 2.3 Register Web App

1. In Project Overview, click **Web** icon (</>)
2. Register app:
   - **App nickname**: TherapyConnect Web
   - **Also set up Firebase Hosting**: Leave unchecked
3. Copy the Firebase config object

### 2.4 Get Firebase Credentials

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "therapyconnect-xxx.firebaseapp.com",
  projectId: "therapyconnect-xxx",
  storageBucket: "therapyconnect-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2.5 Add to Configuration

Update `config/firebase-config.js`:
```javascript
const firebaseConfig = {
    apiKey: "AIza...your_api_key",
    authDomain: "therapyconnect-xxx.firebaseapp.com",
    projectId: "therapyconnect-xxx",
    storageBucket: "therapyconnect-xxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

---

## Part 3: Stripe Setup (Payments)

### 3.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Complete business details (can skip for test mode)

### 3.2 Create Products and Prices

#### Basic Subscription ($29/month)
1. Go to **Products** → **Add Product**
2. **Name**: Basic Plan
3. **Description**: Unlimited messaging, 2 video sessions/month
4. **Pricing model**: Standard pricing
5. **Price**: $29 USD
6. **Billing period**: Monthly
7. **Price description**: Basic Monthly
8. **Lookup key**: basic_monthly
9. Click **Save product**
10. **Copy the Price ID** (starts with `price_`)

#### Premium Subscription ($79/month)
1. Create another product
2. **Name**: Premium Plan
3. **Description**: Unlimited sessions, priority booking
4. **Price**: $79 USD
5. **Billing period**: Monthly
6. **Lookup key**: premium_monthly
7. **Copy the Price ID**

#### Therapy Sessions
1. Create product: **60-Minute Session**
   - Price: $80 USD
   - **One-time payment**
   - Lookup key: session_60min
   - Copy Price ID

2. Create product: **90-Minute Session**
   - Price: $120 USD
   - One-time payment
   - Lookup key: session_90min
   - Copy Price ID

### 3.3 Get Stripe API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3.4 Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - For local testing: Use ngrok or localtunnel
   - `ngrok http 3000` → Use the HTTPS URL
4. **Listen to**: Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_`)

### 3.5 Add to Environment Variables

Update `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Update `config/stripe-config.js`:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key';
const PRICES = {
    basic_monthly: 'price_xxxxx',
    premium_monthly: 'price_xxxxx',
    session_60min: 'price_xxxxx',
    session_90min: 'price_xxxxx'
};
```

Update `js/stripe-client.js` (line 5):
```javascript
const stripe = Stripe('pk_test_your_publishable_key');
```

---

## Part 4: Running the Backend

### 4.1 Install Dependencies

```bash
cd TherapyConnect_Fixed
npm install
```

### 4.2 Verify Environment Variables

Check your `.env` file has all these:
```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Node Environment
NODE_ENV=development
PORT=3000
```

### 4.3 Start the Server

```bash
npm start
```

You should see:
```
TherapyConnect API running on port 3000
Environment: development
```

### 4.4 Test API Health

Open browser: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-01-10T12:00:00.000Z",
  "service": "TherapyConnect API"
}
```

---

## Part 5: Testing the Integration

### 5.1 Test Stripe Payment (Test Mode)

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Expiration: Any future date  
CVC: Any 3 digits  
ZIP: Any 5 digits

### 5.2 Test Firebase Authentication

1. Open your app in browser
2. Try sign up with email/password
3. Check Firebase Console → Authentication → Users
4. You should see the new user

### 5.3 Test Supabase Database

1. After sign up, check Supabase → Table Editor → `users`
2. You should see the user profile created
3. Try booking a session → Check `sessions` table

---

## Part 6: Deployment to Production

### 6.1 Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Add Environment Variables in Vercel Dashboard**:
   - Go to project → Settings → Environment Variables
   - Add all variables from `.env`
   - Make sure to add to **Production**, **Preview**, and **Development**

5. **Update Stripe Webhook URL**:
   - In Stripe Dashboard, update webhook endpoint
   - New URL: `https://your-vercel-app.vercel.app/api/stripe/webhook`

### 6.2 Update Firebase Authorized Domains

1. Firebase Console → Authentication → Settings
2. **Authorized domains** → Add:
   - `your-vercel-app.vercel.app`
   - Any custom domains

---

## Part 7: Security Checklist

### ✅ Before Going Live

- [ ] Change all API keys from test to production
- [ ] Enable Stripe live mode
- [ ] Set `NODE_ENV=production` in Vercel
- [ ] Review Supabase RLS policies
- [ ] Enable Firebase App Check
- [ ] Add custom domain with SSL
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CORS for production domains only
- [ ] Enable rate limiting on API endpoints
- [ ] Set up database backups
- [ ] Review HIPAA compliance requirements
- [ ] Get BAA (Business Associate Agreement) from providers
- [ ] Enable 2FA on all service accounts

---

## Part 8: Troubleshooting

### Issue: Supabase RLS blocking queries

**Solution**: Check user is authenticated:
```javascript
import { supabase } from './supabase-client.js';

// Get current session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Issue: Stripe webhook failing

**Solution**: 
1. Check webhook secret is correct
2. Test with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

### Issue: Firebase auth not working

**Solution**: 
1. Check domain is authorized in Firebase Console
2. Verify API key is correct
3. Check browser console for errors

### Issue: CORS errors

**Solution**: Update `server.js` CORS config:
```javascript
app.use(cors({
    origin: ['https://your-domain.com', 'http://localhost:3000'],
    credentials: true
}));
```

---

## Part 9: API Endpoints Reference

### Authentication (Firebase)
- Sign up: Use `firebase-auth.js` → `signUp()`
- Sign in: `signIn(email, password)`
- Google OAuth: `signInWithGoogle()`
- Sign out: `logOut()`

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get single therapist

### Sessions/Bookings
- `POST /api/sessions` - Book a session
- `GET /api/sessions?user_id=xxx` - Get user's sessions
- `PATCH /api/sessions/:id/cancel` - Cancel session

### Stripe Payments
- `POST /api/stripe/create-checkout-session` - Create payment
- `POST /api/stripe/create-portal-session` - Manage subscription
- `GET /api/stripe/subscription?user_id=xxx` - Get subscription
- `GET /api/stripe/invoices?user_id=xxx` - Get billing history

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile

---

## Part 10: Next Steps

### Recommended Features to Add

1. **Video Calling**
   - Integrate Twilio or Daily.co
   - Add video session links to bookings

2. **Email Notifications**
   - Use SendGrid or AWS SES
   - Send booking confirmations
   - Appointment reminders (24h before)

3. **SMS Reminders**
   - Twilio SMS
   - Send 1-hour before session

4. **Analytics**
   - Google Analytics 4
   - Mixpanel for user behavior
   - Track conversions

5. **Admin Dashboard**
   - Manage therapists
   - View analytics
   - Handle support tickets

6. **Mobile App**
   - React Native
   - Flutter
   - Capacitor (reuse web code)

---

## Support

### Documentation Links
- [Supabase Docs](https://supabase.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Community Support
- [Supabase Discord](https://discord.supabase.com)
- [Firebase Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Stripe Discord](https://stripe.com/discord)

---

## License

This project is for educational purposes. Make sure to comply with:
- **HIPAA** (Health Insurance Portability and Accountability Act)
- **GDPR** (if serving EU users)
- **CCPA** (California Consumer Privacy Act)

Get legal review before handling real patient data.

---

**🎉 Congratulations!** Your TherapyConnect platform is now fully integrated with authentication, database, and payments. Users can sign up, book therapists, and make real payments!
