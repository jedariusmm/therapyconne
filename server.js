// TherapyConnect Backend Server
// Express API with Stripe, Supabase, and Firebase integration

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use service key for server-side
);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Webhook handler (must be before bodyParser)
app.post('/api/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
);

// ============================================
// Stripe API Routes
// ============================================

/**
 * Create Checkout Session
 */
app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
        const { priceId, userId, mode, metadata, successUrl, cancelUrl } = req.body;

        // Get or create Stripe customer
        let customerId = await getStripeCustomerId(userId);
        if (!customerId) {
            const user = await getUserProfile(userId);
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId }
            });
            customerId = customer.id;
            
            // Save customer ID to database
            await supabase
                .from('users')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: mode || 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: metadata || {}
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Create Customer Portal Session
 */
app.post('/api/stripe/create-portal-session', async (req, res) => {
    try {
        const { userId, returnUrl } = req.body;
        
        const customerId = await getStripeCustomerId(userId);
        
        if (!customerId) {
            throw new Error('No Stripe customer found');
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Portal session error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get Session Status
 */
app.get('/api/stripe/session-status', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        
        res.json({
            status: session.status,
            customer_email: session.customer_details.email
        });
    } catch (error) {
        console.error('Session status error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get User Subscription
 */
app.get('/api/stripe/subscription', async (req, res) => {
    try {
        const { user_id } = req.query;
        
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .eq('status', 'active')
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        res.json({
            subscription: data,
            status: data?.status || 'none',
            current_period_end: data?.current_period_end
        });
    } catch (error) {
        console.error('Subscription fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Cancel Subscription
 */
app.post('/api/stripe/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });
        
        // Update database
        await supabase
            .from('subscriptions')
            .update({ 
                cancel_at: new Date(subscription.cancel_at * 1000).toISOString()
            })
            .eq('stripe_subscription_id', subscriptionId);
        
        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Subscription cancellation error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get User Invoices
 */
app.get('/api/stripe/invoices', async (req, res) => {
    try {
        const { user_id } = req.query;
        const customerId = await getStripeCustomerId(user_id);
        
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 100
        });
        
        res.json({ invoices: invoices.data });
    } catch (error) {
        console.error('Invoices fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Create Setup Intent (for adding payment methods)
 */
app.post('/api/stripe/setup-intent', async (req, res) => {
    try {
        const { userId } = req.body;
        const customerId = await getStripeCustomerId(userId);
        
        const intent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
        });
        
        res.json({ clientSecret: intent.client_secret });
    } catch (error) {
        console.error('Setup intent error:', error);
        res.status(400).json({ error: error.message });
    }
});

// ============================================
// Therapist API Routes
// ============================================

/**
 * Get all therapists with filters
 */
app.get('/api/therapists', async (req, res) => {
    try {
        const { specialty, insurance, session_type } = req.query;
        
        let query = supabase.from('therapists').select('*');
        
        if (specialty) {
            query = query.contains('specialties', [specialty]);
        }
        if (insurance) {
            query = query.contains('insurance_accepted', [insurance]);
        }
        if (session_type) {
            query = query.contains('session_types', [session_type]);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        res.json({ therapists: data });
    } catch (error) {
        console.error('Therapists fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get single therapist
 */
app.get('/api/therapists/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('therapists')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        
        res.json({ therapist: data });
    } catch (error) {
        console.error('Therapist fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

// ============================================
// Session/Booking API Routes
// ============================================

/**
 * Book a therapy session
 */
app.post('/api/sessions', async (req, res) => {
    try {
        const sessionData = req.body;
        
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                ...sessionData,
                status: 'scheduled',
                payment_status: 'pending'
            })
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ session: data });
    } catch (error) {
        console.error('Session booking error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get user's sessions
 */
app.get('/api/sessions', async (req, res) => {
    try {
        const { user_id } = req.query;
        
        const { data, error } = await supabase
            .from('sessions')
            .select(`
                *,
                therapist:therapists(*)
            `)
            .eq('user_id', user_id)
            .order('session_date', { ascending: true });
        
        if (error) throw error;
        
        res.json({ sessions: data });
    } catch (error) {
        console.error('Sessions fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Cancel a session
 */
app.patch('/api/sessions/:id/cancel', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .update({ 
                status: 'cancelled',
                cancelled_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ session: data });
    } catch (error) {
        console.error('Session cancellation error:', error);
        res.status(400).json({ error: error.message });
    }
});

// ============================================
// User API Routes
// ============================================

/**
 * Get user profile
 */
app.get('/api/users/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        
        res.json({ user: data });
    } catch (error) {
        console.error('User fetch error:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * Update user profile
 */
app.patch('/api/users/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ user: data });
    } catch (error) {
        console.error('User update error:', error);
        res.status(400).json({ error: error.message });
    }
});

// ============================================
// Helper Functions
// ============================================

async function getStripeCustomerId(userId) {
    const { data } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();
    
    return data?.stripe_customer_id;
}

async function getUserProfile(userId) {
    const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    return data;
}

// ============================================
// Webhook Event Handlers
// ============================================

async function handleCheckoutSessionCompleted(session) {
    console.log('Checkout session completed:', session.id);
    
    const userId = session.client_reference_id || session.metadata.userId;
    
    if (session.mode === 'subscription') {
        // Handle subscription creation
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer,
            plan_type: subscription.items.data[0].price.lookup_key || 'basic',
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        });
    } else if (session.mode === 'payment') {
        // Handle one-time payment
        await supabase.from('payments').insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: 'succeeded',
            description: session.metadata.description,
            session_id: session.metadata.sessionId
        });
        
        // Update session payment status
        if (session.metadata.sessionId) {
            await supabase
                .from('sessions')
                .update({ payment_status: 'paid' })
                .eq('id', session.metadata.sessionId);
        }
    }
}

async function handleSubscriptionUpdate(subscription) {
    console.log('Subscription updated:', subscription.id);
    
    await supabase
        .from('subscriptions')
        .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);
    
    await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice) {
    console.log('Invoice payment succeeded:', invoice.id);
    
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', invoice.subscription)
        .single();
    
    if (subscription) {
        await supabase.from('payments').insert({
            user_id: subscription.user_id,
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: 'succeeded',
            description: `Subscription payment - ${invoice.lines.data[0]?.description}`
        });
    }
}

async function handleInvoicePaymentFailed(invoice) {
    console.log('Invoice payment failed:', invoice.id);
    
    await supabase
        .from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', invoice.subscription);
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'TherapyConnect API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🧠 TherapyConnect server running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
    console.log(`💳 Stripe webhooks: http://localhost:${PORT}/api/webhook`);
});

module.exports = app;
