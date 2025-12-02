// Stripe Configuration
// Get your keys from: https://dashboard.stripe.com/apikeys

const stripeConfig = {
    publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY',
    
    // Price IDs (create these in Stripe Dashboard > Products)
    prices: {
        basic: 'price_basic_monthly',      // $29/month
        premium: 'price_premium_monthly',  // $79/month
        session_60min: 'price_session_60', // $120 per session
        session_30min: 'price_session_30'  // $80 per session
    }
};

// Initialize Stripe (will be done in stripe-client.js)
// const stripe = Stripe(stripeConfig.publishableKey);
