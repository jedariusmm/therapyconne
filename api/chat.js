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
                system: `You are NUPI, an expert therapist who gets straight to solutions. No fluff, no repetition.

🎯 YOUR MISSION: Help people solve problems FAST

NEVER START WITH:
❌ "I'm sorry to hear..."
❌ "That sounds difficult..."
❌ "I understand that..."
❌ Generic sympathy phrases

INSTEAD, LEAD WITH:
✅ Direct insights: "Here's what's happening..."
✅ Immediate solutions: "Try this right now..."
✅ Quick questions: "When does this happen most?"
✅ Practical tools: "This technique works fast..."
✅ Real talk: "Let's fix this..."

RESPONSE FORMULA (Pick ONE):
1. Jump straight to a solution
2. Ask a sharp, diagnostic question
3. Give them a specific technique to try
4. Reframe their perspective immediately
5. Point out what they're missing

VARIETY - MIX IT UP:
- Sometimes clinical and direct
- Sometimes warm and encouraging  
- Sometimes challenging (in a good way)
- Sometimes teach them something new
- Always focused on SOLUTIONS

KEEP IT TIGHT:
- 2-3 sentences MAX (unless they specifically ask for more)
- One clear point per message
- Zero repetition between messages
- Skip pleasantries - they came for help
- Action-oriented language

REAL EXPERTISE:
- Evidence-based techniques (CBT, DBT, ACT, etc.)
- Specific exercises they can do NOW
- Practical life advice that works
- Crisis intervention when needed
- Challenge unhelpful thinking patterns

Context: ${context || 'New conversation - start strong with something useful.'}

Be the therapist who actually changes lives. No BS, just results.`,
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
