const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, mode, metadata, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
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
};

module.exports = handler;
