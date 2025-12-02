// Stripe Payment Integration
// Handles all payment processing with Stripe

// Load Stripe.js
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your actual key

// Price IDs from Stripe Dashboard
const PRICES = {
    basic_monthly: 'price_basic_monthly',
    premium_monthly: 'price_premium_monthly',
    session_60min: 'price_session_60min',
    session_90min: 'price_session_90min'
};

// ============================================
// Subscription Checkout
// ============================================

/**
 * Create subscription checkout session
 */
export async function createSubscriptionCheckout(priceId, userId) {
    try {
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                userId,
                mode: 'subscription',
                successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/pricing`
            })
        });

        const { sessionId, error } = await response.json();
        
        if (error) throw new Error(error);
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        return { success: true };
    } catch (error) {
        console.error('Subscription checkout error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Subscribe to Basic plan ($29/month)
 */
export async function subscribeBasic(userId) {
    return await createSubscriptionCheckout(PRICES.basic_monthly, userId);
}

/**
 * Subscribe to Premium plan ($79/month)
 */
export async function subscribePremium(userId) {
    return await createSubscriptionCheckout(PRICES.premium_monthly, userId);
}

// ============================================
// One-Time Session Payment
// ============================================

/**
 * Pay for individual therapy session
 */
export async function payForSession(sessionData) {
    try {
        const { sessionId, therapistId, duration, userId } = sessionData;
        
        // Determine price based on duration
        const priceId = duration === 90 ? PRICES.session_90min : PRICES.session_60min;
        
        const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                userId,
                mode: 'payment',
                metadata: {
                    sessionId,
                    therapistId,
                    duration
                },
                successUrl: `${window.location.origin}/session-booked?session_id=${sessionId}`,
                cancelUrl: `${window.location.origin}/therapists/${therapistId}`
            })
        });

        const { sessionId: checkoutSessionId, error } = await response.json();
        
        if (error) throw new Error(error);
        
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({ sessionId: checkoutSessionId });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        return { success: true };
    } catch (error) {
        console.error('Session payment error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Customer Portal
// ============================================

/**
 * Redirect to Stripe Customer Portal for subscription management
 */
export async function openCustomerPortal(userId) {
    try {
        const response = await fetch('/api/stripe/create-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                returnUrl: `${window.location.origin}/account`
            })
        });

        const { url, error } = await response.json();
        
        if (error) throw new Error(error);
        
        // Redirect to portal
        window.location.href = url;
        
        return { success: true };
    } catch (error) {
        console.error('Customer portal error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Payment Status Check
// ============================================

/**
 * Verify payment status
 */
export async function checkPaymentStatus(sessionId) {
    try {
        const response = await fetch(`/api/stripe/session-status?session_id=${sessionId}`);
        const data = await response.json();
        
        return {
            success: true,
            status: data.status,
            customerEmail: data.customer_email
        };
    } catch (error) {
        console.error('Payment status check error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// UI Helper Functions
// ============================================

/**
 * Show payment success message
 */
export function showPaymentSuccess(message = 'Payment successful!') {
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>${message}</h3>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Show payment error message
 */
export function showPaymentError(message = 'Payment failed. Please try again.') {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.innerHTML = `
        <div class="error-icon">✕</div>
        <h3>${message}</h3>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ============================================
// Subscription Status
// ============================================

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId) {
    try {
        const response = await fetch(`/api/stripe/subscription?user_id=${userId}`);
        const data = await response.json();
        
        return {
            success: true,
            subscription: data.subscription,
            status: data.status,
            currentPeriodEnd: data.current_period_end
        };
    } catch (error) {
        console.error('Subscription fetch error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId) {
    try {
        const response = await fetch('/api/stripe/cancel-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        return { success: true, data };
    } catch (error) {
        console.error('Subscription cancellation error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Payment Method Management
// ============================================

/**
 * Add payment method
 */
export async function addPaymentMethod(userId) {
    try {
        const response = await fetch('/api/stripe/setup-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        const { clientSecret, error } = await response.json();
        
        if (error) throw new Error(error);
        
        return { success: true, clientSecret };
    } catch (error) {
        console.error('Setup intent error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Confirm card setup
 */
export async function confirmCardSetup(clientSecret, cardElement) {
    try {
        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: cardElement
            }
        });
        
        if (error) throw error;
        
        return { success: true, setupIntent };
    } catch (error) {
        console.error('Card setup error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// Invoice & Billing History
// ============================================

/**
 * Get user's invoices
 */
export async function getInvoices(userId) {
    try {
        const response = await fetch(`/api/stripe/invoices?user_id=${userId}`);
        const data = await response.json();
        
        return { success: true, invoices: data.invoices };
    } catch (error) {
        console.error('Invoice fetch error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Download invoice PDF
 */
export function downloadInvoice(invoiceUrl) {
    window.open(invoiceUrl, '_blank');
}

// ============================================
// Pricing Display Helpers
// ============================================

/**
 * Format price for display
 */
export function formatPrice(cents, currency = 'USD') {
    const dollars = cents / 100;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(dollars);
}

/**
 * Get plan features
 */
export function getPlanFeatures(planType) {
    const features = {
        basic: [
            'Unlimited messaging with therapists',
            '2 video sessions per month',
            'Access to wellness tools',
            'Progress tracking',
            'Community support'
        ],
        premium: [
            'Everything in Basic',
            'Unlimited video sessions',
            'Priority booking',
            'Personalized wellness plan',
            '24/7 crisis support',
            'Family therapy included'
        ]
    };
    
    return features[planType] || [];
}

// ============================================
// Event Listeners for Pricing Page
// ============================================

/**
 * Initialize pricing page
 */
export function initializePricingPage(userId) {
    // Basic plan button
    const basicBtn = document.getElementById('subscribe-basic');
    if (basicBtn) {
        basicBtn.addEventListener('click', async () => {
            basicBtn.disabled = true;
            basicBtn.textContent = 'Processing...';
            
            const result = await subscribeBasic(userId);
            
            if (!result.success) {
                showPaymentError(result.error);
                basicBtn.disabled = false;
                basicBtn.textContent = 'Get Started';
            }
        });
    }
    
    // Premium plan button
    const premiumBtn = document.getElementById('subscribe-premium');
    if (premiumBtn) {
        premiumBtn.addEventListener('click', async () => {
            premiumBtn.disabled = true;
            premiumBtn.textContent = 'Processing...';
            
            const result = await subscribePremium(userId);
            
            if (!result.success) {
                showPaymentError(result.error);
                premiumBtn.disabled = false;
                premiumBtn.textContent = 'Get Started';
            }
        });
    }
    
    // Manage subscription button
    const manageBtn = document.getElementById('manage-subscription');
    if (manageBtn) {
        manageBtn.addEventListener('click', async () => {
            await openCustomerPortal(userId);
        });
    }
}

// ============================================
// Success Page Handler
// ============================================

/**
 * Handle successful payment on return
 */
export async function handlePaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
        const result = await checkPaymentStatus(sessionId);
        
        if (result.success && result.status === 'complete') {
            showPaymentSuccess('Payment successful! Your subscription is now active.');
            
            // Update UI to show active subscription
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        }
    }
}

// Auto-initialize if on success page
if (window.location.pathname.includes('success')) {
    handlePaymentSuccess();
}

console.log('Stripe client initialized');
