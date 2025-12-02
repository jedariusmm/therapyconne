# 🚀 TherapyConnect Quick Start

**Get your therapy platform running in 15 minutes!**

---

## What You Have

✅ **Complete Frontend** - 24 pages + 6 therapy games (already deployed!)  
✅ **Backend Integration** - Supabase + Firebase + Stripe (needs setup)  
✅ **Modern Design** - 2025 Gen Z + Baby Boomer optimized  
✅ **Payment System** - Subscriptions + one-time payments  

**Live Demo**: https://therapyconnect-2025-iz022y4mo-jedariusm-9786s-projects.vercel.app

---

## 📋 Files Created

### Backend Integration (NEW)
- `js/firebase-auth.js` - Complete authentication (sign up, sign in, Google OAuth)
- `js/supabase-client.js` - Database operations (users, therapists, sessions)
- `js/stripe-client.js` - Payment processing (subscriptions, checkouts)
- `server.js` - Express API with all endpoints
- `supabase-schema.sql` - Database schema (10 tables)

### Configuration
- `config/firebase-config.js` - Firebase credentials (needs your keys)
- `config/supabase-config.js` - Supabase credentials (needs your keys)
- `config/stripe-config.js` - Stripe price IDs (needs your keys)
- `.env.template` - Environment variable template

### Documentation
- `BACKEND_SETUP_GUIDE.md` - Complete step-by-step setup (READ THIS!)
- `README_FULLSTACK.md` - Full project documentation
- This file!

---

## ⚡ Quick Setup (15 minutes)

### Step 1: Create Accounts (5 min)

1. **Supabase** → [supabase.com](https://supabase.com) - Free tier ✅
2. **Firebase** → [console.firebase.google.com](https://console.firebase.google.com) - Free Spark plan ✅
3. **Stripe** → [stripe.com](https://stripe.com) - Free test mode ✅

### Step 2: Supabase Setup (3 min)

```bash
# 1. Create new project at supabase.com
# 2. Go to SQL Editor → New Query
# 3. Copy contents of supabase-schema.sql
# 4. Paste and click RUN
# ✅ Creates 10 tables with security policies
```

Get your keys:
- Settings → API → Copy **Project URL** and **anon key**

### Step 3: Firebase Setup (3 min)

```bash
# 1. Create new project at console.firebase.google.com
# 2. Build → Authentication → Get Started
# 3. Enable Email/Password + Google Sign-in
# 4. Project Settings → Add Web App
# 5. Copy the config object
```

### Step 4: Stripe Setup (4 min)

```bash
# 1. Create account at stripe.com
# 2. Products → Add Product
#    - Basic Plan: $29/month (recurring)
#    - Premium Plan: $79/month (recurring)
#    - 60min Session: $80 (one-time)
#    - 90min Session: $120 (one-time)
# 3. Copy each Price ID (starts with price_)
# 4. Developers → API keys → Copy keys
```

### Step 5: Configure Your Project (2 min)

```bash
# 1. Copy environment template
cp .env.template .env

# 2. Edit .env with your keys
nano .env
# (or open in VS Code)

# 3. Update config files
# - config/firebase-config.js (paste Firebase config)
# - config/supabase-config.js (paste Supabase URL & key)
# - config/stripe-config.js (paste Stripe publishable key & price IDs)
# - js/stripe-client.js line 5 (paste Stripe publishable key)
```

---

## 🎮 Running Locally

```bash
# Install dependencies
npm install

# Start server
npm start

# Open browser
open http://localhost:3000
```

Test it:
1. Sign up with email/password
2. Browse therapists
3. Book a session
4. Use test card: `4242 4242 4242 4242`

---

## 🚀 Deploy to Production

```bash
# Install Vercel
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Settings → Environment Variables → Add all from .env

# Update Stripe webhook
# Stripe → Webhooks → Add endpoint:
# https://your-app.vercel.app/api/stripe/webhook
```

---

## ✅ What Works Right Now

### Frontend (100% Complete)
- ✅ 24 pages all functional
- ✅ 6 therapy games working
- ✅ Modern 2025 design
- ✅ Mobile responsive
- ✅ WCAG accessibility

### Backend (Integration Ready)
- ✅ Firebase auth module written
- ✅ Supabase client written
- ✅ Stripe integration written
- ✅ Express API server written
- ✅ Database schema ready
- ⚠️ **Needs your API keys to activate**

---

## 🔑 Get Your API Keys

### Supabase
1. Go to: https://app.supabase.com
2. Your Project → Settings → API
3. Copy: **URL** and **anon/public key**

### Firebase
1. Go to: https://console.firebase.google.com
2. Project Settings → General
3. Scroll to "Your apps" → Web app
4. Copy the `firebaseConfig` object

### Stripe
1. Go to: https://dashboard.stripe.com
2. Developers → API keys
3. Copy: **Publishable key** and **Secret key**
4. Create products → Copy each **Price ID**

---

## 📖 Full Documentation

**For detailed setup**: Read `BACKEND_SETUP_GUIDE.md`  
**For API reference**: Read `README_FULLSTACK.md`  
**For database schema**: See `supabase-schema.sql`

---

## 🆘 Troubleshooting

### "Supabase RLS blocking queries"
➜ User not authenticated. Check Firebase sign-in working.

### "Stripe webhook failing"
➜ Wrong webhook secret. Copy from Stripe → Webhooks → Endpoint → Signing secret

### "Firebase auth not working"
➜ Domain not authorized. Firebase Console → Authentication → Settings → Authorized domains

### "CORS errors"
➜ Update `server.js` line 24 with your domain

---

## 🎯 Next Steps

1. ✅ **Set up API keys** (follow this guide)
2. ✅ **Test locally** (`npm start`)
3. ✅ **Deploy to Vercel** (`vercel`)
4. 🔄 Add video calling (Twilio/Daily.co)
5. 🔄 Add email notifications (SendGrid)
6. 🔄 Mobile app (React Native)

---

## 💡 Pro Tips

**Development:**
- Use test mode for Stripe (keys start with `sk_test_`)
- Firebase has generous free tier (50k auth users)
- Supabase free tier: 500MB database, 1GB file storage

**Security:**
- Never commit `.env` file
- Use environment variables in Vercel
- Enable 2FA on all service accounts

**Testing:**
- Stripe test cards: `4242 4242 4242 4242` (success)
- Test all auth flows before going live
- Check Supabase RLS policies working

---

## 📞 Need Help?

1. **Check `BACKEND_SETUP_GUIDE.md`** - Step-by-step instructions
2. **Browser console** - Check for JavaScript errors
3. **Service dashboards** - Check Supabase/Firebase/Stripe logs
4. **Community support**:
   - Supabase Discord: https://discord.supabase.com
   - Firebase Stack Overflow: tagged `firebase`
   - Stripe Discord: https://stripe.com/discord

---

## 🎉 You're Ready!

Your TherapyConnect platform has:
- ✅ Modern frontend (deployed)
- ✅ Complete backend (needs keys)
- ✅ Payment system (ready)
- ✅ Database schema (ready)
- ✅ API server (ready)

**Just add your API keys and you're live!**

---

**Total Setup Time**: ~15 minutes  
**Cost**: $0 (all free tiers)  
**Next**: Follow `BACKEND_SETUP_GUIDE.md` for detailed walkthrough

**Let's build something amazing! 🚀**
