// Stripe Configuration for TherapyConnect
// Replace with your actual Stripe keys

const STRIPE_CONFIG = {
    // Publishable Key (safe to use in client-side code)
    publishableKey: 'pk_live_51SNpUfBnC0bWNfLeoBetqB1bHztXPZPRqBxTaocOxnZPxUp9N1ZSXRck09ADXoAZS4AN6XnyKSozVbFcbkOFAhp700mCruHk8q',
    
    // Product IDs and Price IDs
    products: {
        trial: {
            priceId: null, // Free trial - no Stripe price needed
            productId: 'prod_trial',
            amount: 0,
            currency: 'usd',
            interval: 'trial',
            trialDays: 30,
            name: 'Free Trial',
            description: '30 days free access with full features'
        },
        basic: {
            priceId: 'price_1QQWTdBnC0bWNfLeKpV0xVCc', // $2.99/month Stripe Price ID
            productId: 'prod_RLv4ybNLz51kag',
            amount: 299, // $2.99 in cents
            currency: 'usd',
            interval: 'month',
            name: 'Basic Therapy Plan',
            description: 'AI therapy sessions and wellness tracker access'
        },
        premium: {
            priceId: 'price_1QQWTwBnC0bWNfLeM8KyTvuV', // $9.99/month Stripe Price ID  
            productId: 'prod_RLv5OvJ2aX1CbX',
            amount: 999, // $9.99 in cents
            currency: 'usd',
            interval: 'month',
            name: 'Premium Therapy Plan',
            description: 'Unlimited AI therapy sessions, full wellness tracking, and progress analytics'
        },
        enterprise: {
            priceId: 'price_enterprise_custom',
            productId: 'prod_enterprise',
            amount: null, // Custom pricing
            currency: 'usd',
            interval: 'month',
            name: 'Enterprise Plan',
            description: 'Unlimited sessions with custom features'
        }
    },
    
    // Stripe Checkout Configuration
    checkout: {
        mode: 'subscription',
        successUrl: `${window.location.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/sign-in.html?tab=signup`,
        billingAddressCollection: 'auto',
        allowPromotionCodes: true
    }
};

// Initialize Stripe
let stripe = null;

function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js not loaded');
        return false;
    }
    
    try {
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
        console.log('✅ Stripe initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing Stripe:', error);
        return false;
    }
}

// Create Checkout Session
async function createCheckoutSession(planType, userEmail) {
    const plan = STRIPE_CONFIG.products[planType];
    
    if (!plan) {
        throw new Error('Invalid plan type');
    }
    
    // Free trial - no payment required
    if (planType === 'trial') {
        console.log('Free trial activated - no payment required');
        return Promise.resolve({ success: true, trial: true });
    }
    
    if (planType === 'enterprise') {
        // Redirect to contact page for enterprise
        window.location.href = 'contact.html?plan=enterprise';
        return;
    }
    
    try {
        // Call your backend to create a checkout session
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: plan.priceId,
                customerEmail: userEmail,
                successUrl: STRIPE_CONFIG.checkout.successUrl,
                cancelUrl: STRIPE_CONFIG.checkout.cancelUrl
            })
        });
        
        const session = await response.json();
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount / 100);
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STRIPE_CONFIG,
        initializeStripe,
        createCheckoutSession,
        formatCurrency
    };
}
