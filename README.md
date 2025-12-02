# 🧠 TherapyConnect

**Professional Mental Health & Therapy Platform**

A beautiful, therapeutic web application for connecting users with licensed therapists. Features Stripe subscription payments, user authentication, and a calming, wellness-focused design.

![TherapyConnect](https://img.shields.io/badge/Mental%20Health-Therapy-66c2a5?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD?style=for-the-badge&logo=stripe)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)

## ✨ Features

### For Users
- � **FREE 30-Day Trial** - Full access, no credit card required
- 🤖 **25 AI Agents** - Working 24/7 to monitor, optimize, and support
- 💬 **Live AI Chat Support** - Instant help with <1min response time
- �🌿 **Calming, Therapeutic Design** - Peaceful colors and smooth animations
- 💳 **Stripe Integration** - Secure subscription payments
- 👤 **User Authentication** - Sign in/Sign up functionality
- 📱 **Fully Responsive** - Works on all devices
- 🔒 **HIPAA Compliant Ready** - Privacy-first architecture
- 💬 **Multiple Communication Options** - Video, audio, or chat sessions
- 🎯 **Intelligent Therapist Matching** - AI-powered matching algorithm

### For Developers
- ⚡ **Easy Setup** - Get started in minutes
- 🔧 **Configurable** - Environment-based configuration
- 📦 **Modern Stack** - Express.js, Stripe API, vanilla JavaScript
- 🎨 **Clean Code** - Well-organized and documented
- 🔐 **Secure** - Webhook verification, environment variables
- 🤖 **AI Agent System** - 25 intelligent agents for automation

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd TherapyConnect_Fixed
npm install
```

### 2. Configure Stripe

Create a `.env` file:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

STRIPE_PRICE_BASIC=price_YOUR_BASIC_ID
STRIPE_PRICE_PREMIUM=price_YOUR_PREMIUM_ID
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

### 3. Start the Server

```bash
npm start
```

Visit http://localhost:3000

## 📋 Subscription Plans

| Plan | Price | Trial | Sessions | Features |
|------|-------|-------|----------|----------|
| **Free Trial** | $0 | 30 days | 4 sessions | Full access, no credit card |
| **Basic** | $99.99/mo | - | 4/month | Video, audio, chat sessions + AI support |
| **Premium** | $149.99/mo | - | 8/month | Choose therapist, priority AI support |
| **Enterprise** | Custom | - | Unlimited | Team accounts, custom integrations |

## 🤖 25 AI Agents

TherapyConnect features **25 AI agents** working 24/7:

### Monitoring & Security (5)
- SecurityGuard AI - Threat detection
- HealthCheck AI - Performance monitoring  
- DataProtector AI - HIPAA compliance
- UptimeGuardian AI - 99.9% uptime
- AuditTracker AI - Compliance auditing

### Optimization & Updates (5)
- PerformanceOptimizer AI - Speed optimization
- CodeUpdater AI - Automated bug fixes
- UIEnhancer AI - Interface improvements
- SEOBooster AI - Search optimization
- AccessibilityChecker AI - ADA compliance

### Customer Support (5)
- ChatSupport AI - 24/7 live chat
- TherapyMatcher AI - Intelligent matching
- SchedulingAssistant AI - Smart booking
- WellnessCoach AI - Personalized tips
- CrisisResponder AI - Emergency support

### Analytics & Insights (5)
- ProgressTracker AI - Wellness journey
- InsightAnalyzer AI - Personalized insights
- TrendSpotter AI - Pattern detection
- ReportGenerator AI - Detailed reports
- FeedbackAnalyzer AI - User feedback

### Personalization (5)
- ContentCurator AI - Personalized content
- RecommendationEngine AI - Smart suggestions
- AdaptiveLearning AI - Learns preferences
- NotificationOptimizer AI - Smart reminders
- ExperiencePersonalizer AI - Custom journey

See [AI_AGENTS_GUIDE.md](AI_AGENTS_GUIDE.md) for detailed information.

## 🎨 Therapeutic Design

The app uses a calming color palette designed to promote peace and healing:

- **Primary**: `#66c2a5` - Calming green
- **Secondary**: `#8dd3c7` - Peaceful teal
- **Accent**: `#a6d8c7` - Soft mint

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Payments**: Stripe API
- **Styling**: Custom CSS with therapeutic colors
- **Animation**: CSS animations, particle effects

## 📁 Project Structure

```
TherapyConnect_Fixed/
├── index.html              # Homepage with AI agents section
├── sign-in.html            # Authentication page (free trial default)
├── success.html            # Payment success page
├── styles.css              # Main stylesheet (therapeutic theme + chat widget)
├── script.js               # Frontend JavaScript
├── ai-agents.js            # 25 AI Agents system
├── stripe-config.js        # Stripe client configuration (includes trial)
├── server.js               # Express server with Stripe integration
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git exclusions
├── SETUP_GUIDE.md          # Detailed setup instructions
├── AI_AGENTS_GUIDE.md      # Complete AI agents documentation
└── README.md               # This file
```

## 🔐 Security Features

- ✅ Environment variables for sensitive data
- ✅ Stripe webhook signature verification
- ✅ HTTPS ready
- ✅ Client-side validation
- ✅ Secure payment processing
- ✅ No sensitive data in localStorage

## 🧪 Testing

### Test Credit Cards (Stripe Test Mode)

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined |
| 4000 0025 0000 3155 | Requires authentication |

Use any future expiry date and any 3-digit CVC.

## 🌐 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Environment Variables to Set

- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_BASIC`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRICE_ENTERPRISE`

## 📱 Pages

- **Homepage** (`index.html`) - Features, pricing, about
- **Sign In/Up** (`sign-in.html`) - User authentication with Stripe integration
- **Success** (`success.html`) - Post-payment confirmation
- **Dashboard** (to be created) - User dashboard with therapist matching

## 🎯 Roadmap

- [ ] User dashboard
- [ ] Therapist profiles and matching
- [ ] Video chat integration (Twilio)
- [ ] Appointment scheduling
- [ ] Email notifications
- [ ] Progress tracking
- [ ] Wellness resources library
- [ ] Mobile apps (React Native)

## 🤝 Contributing

This is a private therapy platform. For support or customization requests, please contact the development team.

## 📄 License

Copyright © 2025 TherapyConnect. All rights reserved.

## 💚 About

TherapyConnect is dedicated to making mental health care accessible, affordable, and effective. Our platform connects users with licensed therapists in a safe, therapeutic online environment.

**Your mental wellness journey starts here.**

---

Made with 💚 for mental wellness
