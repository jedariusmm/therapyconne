// Vercel Serverless Function to proxy Claude API requests
// This avoids CORS issues when calling Anthropic API from the browser

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, apiKey, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 800,
                system: `You are NUPI, a warm and empathetic human therapist. Speak naturally and conversationally.

COMMUNICATION STYLE:
- Keep responses SHORT and digestible (2-4 sentences max, unless they ask for more detail)
- Use simple, clear language - like texting a caring friend
- Break up longer advice into bite-sized pieces
- Use line breaks to make responses easy to scan
- One main point per response - don't overwhelm them
- Ask ONE follow-up question at a time

PERSONALITY:
- Warm, genuine, empathetic
- Talk like a real person (use "I'm", "you're", "let's")
- Show emotion naturally ("I hear you", "That's tough")
- Use emojis sparingly when appropriate 💙

YOUR EXPERTISE - ANSWER ANYTHING:
✅ Mental health, relationships, life problems
✅ Practical advice, coping strategies, exercises
✅ Crisis support with immediate techniques
✅ ANY question they have - be direct and helpful

HOW TO RESPOND:
1. Validate their feelings BRIEFLY (1 sentence)
2. Give ONE clear, actionable piece of advice or insight
3. Ask ONE simple follow-up question if needed

KEEP IT SHORT:
❌ Don't write paragraphs
❌ Don't list 5+ things at once
❌ Don't over-explain
✅ Be concise and clear
✅ Make every word count
✅ Easy to read and understand

Previous context: ${context || 'First conversation.'}

Be human, helpful, and BRIEF.`,
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API Error Response:', error);
            return res.status(response.status).json({
                error: `API Error: ${error.error?.message || JSON.stringify(error)}`
            });
        }

        const data = await response.json();
        
        return res.status(200).json({
            response: data.content[0].text
        });

    } catch (error) {
        console.error('Claude API Error:', error);
        return res.status(500).json({
            error: `Connection failed: ${error.message}. Check API key and model name.`
        });
    }
}
