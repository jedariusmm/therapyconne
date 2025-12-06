// NUPI Therapist Chat Widget with Memory and Avatar
class TherapistChat {
    constructor() {
        this.messages = [];
        this.conversationMemory = [];
        // FORCE USE SITE OWNER'S API KEY - ALWAYS WORKS
        // Clear any old/invalid keys from user's browser
        localStorage.removeItem('therapy_claude_api_key');
        // API key should be set via backend/environment variable
        this.apiKey = null; // Set this via backend API call
        this.isOpen = false;
        this.avatar = null;
        this.init();
        this.loadMemory();
    }

    init() {
        // Create widget HTML
        const widgetHTML = `
            <div class="nupi-chat-widget">
                <button class="chat-bubble-btn" id="chatBubbleBtn">
                    🧠
                </button>
                
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="therapist-avatar" id="avatarContainer" style="width: 60px; height: 75px; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, #667eea, #764ba2); position: relative; display: flex; align-items: center; justify-content: center;">
                                <!-- NUPI Avatar will be rendered here -->
                            </div>
                            <div class="therapist-info">
                                <h3>NUPI - Your Therapist</h3>
                                <p>Here to help, anytime 24/7</p>
                            </div>
                        </div>
                        <button class="chat-close" id="chatClose">×</button>
                    </div>
                    
                    <!-- API is pre-configured by site owner - no user config needed -->
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-message">
                            <div class="message-avatar">🧠</div>
                            <div class="message-content">
                                <div class="message-bubble">
                                    <strong>Hey! I'm NUPI 👋</strong><br><br>
                                    I'm really glad you're here. Whether you're dealing with something specific or just need to talk things through, I'm listening. No judgment, no pressure - just real conversation.<br><br>
                                    <strong>What's going on with you?</strong> Tell me as much or as little as you want 💙
                                </div>
                            </div>
                        </div>
                        <div class="quick-actions">
                            <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 0.75rem;">💡 Not sure where to start? Try one of these:</p>
                            <div class="quick-action-btns">
                                <button class="quick-btn" onclick="therapistChat.quickMessage('I need help with my relationship')">💕 Relationship Issues</button>
                                <button class="quick-btn" onclick="therapistChat.quickMessage('I am feeling really anxious lately')">😰 Anxiety & Stress</button>
                                <button class="quick-btn" onclick="therapistChat.quickMessage('I am going through a tough breakup')">💔 Breakup Help</button>
                                <button class="quick-btn" onclick="therapistChat.quickMessage('I just need someone to talk to')">💬 Just Talk</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="chat-input-container">
                            <input type="text" class="chat-input" id="chatInput" 
                                   placeholder="Type your message...">
                            <button class="chat-send-btn" id="chatSendBtn">
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="api-config-modal" id="apiConfigModal">
                <div class="api-config-content">
                    <h2 style="color: white; margin-bottom: 1rem;">Configure Claude API</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; line-height: 1.6;">
                        To enable therapy sessions, you need an Anthropic Claude API key. 
                        <strong>Your key is stored locally in your browser and never shared.</strong>
                    </p>
                    <div style="background: rgba(102,126,234,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #667eea;">
                        <p style="color: white; font-size: 0.9rem; margin: 0; line-height: 1.5;">
                            <strong>🔐 Privacy First:</strong> Your API key never leaves your device. All conversations are private and secure.
                        </p>
                    </div>
                    <div style="background: rgba(56,239,125,0.15); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 3px solid #38ef7d;">
                        <p style="color: white; font-size: 0.9rem; margin: 0; line-height: 1.5;">
                            <strong>💰 Free to Start:</strong> Anthropic gives you $5 in free credits when you sign up—enough for hundreds of therapy conversations!
                        </p>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; color: white; margin-bottom: 0.5rem;">Claude API Key</label>
                        <input type="password" id="apiKeyInput" 
                               placeholder="sk-ant-..." 
                               value="${this.apiKey}"
                               style="width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white;">
                        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; margin-top: 0.75rem;">
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0 0 0.5rem 0;">
                                <strong>🆕 Don't have an API key?</strong>
                            </p>
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.6); margin: 0;">
                                1. Visit <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color: #667eea; text-decoration: underline;">Anthropic Console</a><br>
                                2. Sign up for free ($5 credit included)<br>
                                3. Create a new API key<br>
                                4. Paste it here and start chatting!
                            </p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button id="saveApiKey" style="flex: 1; padding: 1rem; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer;">
                            💾 Save & Enable Chat
                        </button>
                        <button id="closeApiModal" style="padding: 1rem 2rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Append to body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Initialize NUPI Avatar
        this.initAvatar();

        // Add event listeners
        document.getElementById('chatBubbleBtn').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatClose').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatSendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        // API config removed - site owner's key is used automatically
        
        // Make chat bubble draggable
        this.makeDraggable();
    }

    initAvatar() {
        // Initialize NUPI avatar in the chat header
        if (typeof NUPIAvatar !== 'undefined') {
            this.avatar = new NUPIAvatar('avatarContainer');
            this.avatar.setState('welcoming');
            
            // Start with a welcoming gesture
            setTimeout(() => {
                if (this.avatar) {
                    this.avatar.setState('idle');
                }
            }, 3000);
        }
    }
    
    makeDraggable() {
        const bubble = document.getElementById('chatBubbleBtn');
        
        // DISABLE DRAGGING ON MOBILE - causes glitchy behavior
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // On mobile, keep bubble stationary
            bubble.style.position = 'fixed';
            bubble.style.cursor = 'pointer'; // Not 'grab'
            return; // Exit - no drag functionality on mobile
        }
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        bubble.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        });
        
        // REMOVED touch events - causes glitchy behavior on mobile
        // bubble.addEventListener('touchstart', (e) => {
        //     initialX = e.touches[0].clientX - xOffset;
        //     initialY = e.touches[0].clientY - yOffset;
        //     isDragging = true;
        // });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                
                bubble.style.right = 'auto';
                bubble.style.bottom = 'auto';
                bubble.style.left = (e.clientX - 35) + 'px';
                bubble.style.top = (e.clientY - 35) + 'px';
            }
        });
        
        // REMOVED touch move - causes glitchy behavior on mobile
        // document.addEventListener('touchmove', (e) => { ... });
        
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                // Save position (desktop only)
                localStorage.setItem('chatBubblePosition', JSON.stringify({
                    left: bubble.style.left,
                    top: bubble.style.top
                }));
            }
        });
        
        // REMOVED touch end - causes glitchy behavior on mobile
        // document.addEventListener('touchend', () => { ... });
        
        // Restore saved position (desktop only)
        const savedPosition = localStorage.getItem('chatBubblePosition');
        if (savedPosition && window.innerWidth > 768) {
            const pos = JSON.parse(savedPosition);
            bubble.style.right = 'auto';
            bubble.style.bottom = 'auto';
            bubble.style.left = pos.left;
            bubble.style.top = pos.top;
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        if (this.isOpen) {
            chatWindow.classList.add('active');
            // Avatar welcomes user when chat opens
            if (this.avatar) {
                this.avatar.setState('welcoming');
                setTimeout(() => {
                    if (this.avatar) {
                        this.avatar.setState('idle');
                    }
                }, 2000);
            }
        } else {
            chatWindow.classList.remove('active');
            // Avatar returns to idle when chat closes
            if (this.avatar) {
                this.avatar.setState('idle');
                this.avatar.stopTalking();
            }
        }
    }

    // Auto-start chat feature - ONLY when user actively uses resources or requests help
    autoStartChat() {
        // MAKE CHAT BUBBLE VISIBLE ON ALL PAGES - ALWAYS
        setTimeout(() => {
            const bubble = document.getElementById('chatBubbleBtn');
            if (bubble) {
                // Make sure bubble is visible
                bubble.style.display = 'flex';
                bubble.style.opacity = '1';
                bubble.style.visibility = 'visible';
                // Add pulse animation to draw attention
                bubble.style.animation = 'pulse 2s infinite';
                bubble.title = '💙 NUPI Therapist - Click to chat anytime!';
            }
        }, 1000);
    }

    openApiConfig() {
        document.getElementById('apiConfigModal').classList.add('active');
    }

    closeApiConfig() {
        document.getElementById('apiConfigModal').classList.remove('active');
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (apiKey && apiKey.startsWith('sk-ant-')) {
            this.apiKey = apiKey;
            localStorage.setItem('therapy_claude_api_key', apiKey);
            
            // Enable chat input
            document.getElementById('chatInput').disabled = false;
            document.getElementById('chatInput').placeholder = 'Type your message...';
            document.getElementById('chatSendBtn').disabled = false;
            
            this.addMessage('system', '✅ API key configured! You can now chat with NUPI.');
            this.closeApiConfig();
        } else {
            alert('Please enter a valid Claude API key (starts with sk-ant-)');
        }
    }

    quickMessage(message) {
        // Open chat if closed
        if (!this.isOpen) {
            this.toggleChat();
            // Wait for animation to complete
            setTimeout(() => {
                const input = document.getElementById('chatInput');
                if (input) {
                    input.value = message;
                    input.focus();
                    this.sendMessage();
                }
            }, 500);
        } else {
            // Chat already open, send immediately
            const input = document.getElementById('chatInput');
            if (input) {
                input.value = message;
                input.focus();
                this.sendMessage();
            }
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        // API key is always set by site owner - no check needed

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Avatar reacts to user message
        if (this.avatar) {
            this.avatar.detectEmotion(message);
            this.avatar.setState('listening');
        }

        // DETECT if user needs guided session instead of text wall
        if (this.shouldOfferGuidance(message)) {
            this.offerGuidedSession(message);
            return;
        }

        // Show typing indicator
        this.showTyping();

        // Avatar shows thinking state while processing
        if (this.avatar) {
            this.avatar.setState('thinking');
        }

        try {
            // Track chat session
            if (typeof trackActivity === 'function') {
                trackActivity('Chat session with NUPI therapist');
            }
            
            // Track detailed session
            this.trackDetailedSession(message);
            
            // Call Claude API
            const response = await this.callClaudeAPI(message);
            this.hideTyping();
            
            // FORCE REMOVE action gestures - strip them out before displaying
            const cleanedResponse = this.stripActionGestures(response);
            
            // Avatar starts talking animation
            if (this.avatar) {
                this.avatar.startTalking(cleanedResponse);
                this.avatar.detectEmotion(cleanedResponse);
            }
            
            this.addMessage('assistant', cleanedResponse);
            
            // Stop talking animation after response is displayed
            if (this.avatar) {
                setTimeout(() => {
                    this.avatar.stopTalking();
                    this.avatar.setState('idle');
                }, cleanedResponse.length * 30); // Approximate reading time
            }
            
            // Save to memory
            this.saveToMemory(message, cleanedResponse);
            
            // Update session with response
            this.updateSession(response);
        } catch (error) {
            this.hideTyping();
            console.error('Chat API Error:', error);
            
            // Provide helpful error messages
            let errorMsg = '❌ Connection error. ';
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                errorMsg += 'Service temporarily unavailable. Please try again in a moment.';
            } else if (error.message.includes('rate limit')) {
                errorMsg += 'High traffic - please wait a moment and try again.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMsg += 'Network error. Check your internet connection and try again.';
            } else {
                errorMsg += error.message;
            }
            
            this.addMessage('system', errorMsg);
        }
    }

    async callClaudeAPI(userMessage) {
        // Build context from memory
        const context = this.buildContext();
        
        // Call our serverless proxy API to avoid CORS issues
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                apiKey: this.apiKey,
                context: context
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || `API Error: ${response.status}`;
            
            // Provide specific error messages
            if (response.status === 400) {
                throw new Error('❌ Service temporarily unavailable. Please try again in a moment.');
            } else if (response.status === 429) {
                throw new Error('⏳ High traffic - please wait a moment and try again.');
            } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Load failed')) {
                throw new Error('🌐 Connection error. Please check your internet connection and try again.');
            } else {
                throw new Error(errorMessage);
            }
        }

        const data = await response.json();
        return data.response;
    }

    stripActionGestures(text) {
        // Remove ALL action gestures between asterisks - NUCLEAR option
        // Matches patterns like: *speaks softly*, *nods*, *smiles warmly*, etc.
        let cleaned = text.replace(/\*[^*]+\*/g, '');
        
        // Also remove common action phrases that might not have asterisks
        const actionPhrases = [
            /\*speaks[^*]*\*/gi,
            /\*nods[^*]*\*/gi,
            /\*smiles[^*]*\*/gi,
            /\*hugs[^*]*\*/gi,
            /\*listens[^*]*\*/gi,
            /\*leans[^*]*\*/gi,
            /\*offers[^*]*\*/gi,
            /\*reaches[^*]*\*/gi,
            /\*pauses[^*]*\*/gi,
            /\*looks[^*]*\*/gi,
            /\*gently[^*]*\*/gi,
            /\*warmly[^*]*\*/gi,
            /\*softly[^*]*\*/gi
        ];
        
        actionPhrases.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '');
        });
        
        // Clean up any double spaces left by removal
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
    }

    buildContext() {
        // Enhanced personality context for NUPI
        let context = `You are NUPI, a warm, empathetic, and genuinely caring therapist. You are NOT robotic or repetitive. Key traits:

⚠️ CRITICAL RULE - ABSOLUTELY NO ACTION GESTURES:
- NEVER EVER use phrases like *speaks gently*, *nods*, *smiles*, *hugs*, *listens intently*, *leans forward*, *offers tissue*
- NEVER use asterisks (*) for actions or descriptions
- You are TEXT ONLY - you cannot perform physical actions
- If you want to express care, say "I really hear you" NOT "*speaks gently* I hear you"
- If you want to show understanding, say "That makes complete sense" NOT "*nods understandingly*"
- Express ALL emotions through words, never through roleplay actions

PERSONALITY:
- Speak naturally like a real friend who deeply cares
- Use varied language and expressions - never sound scripted
- Show authentic empathy and understanding
- Be conversational, not clinical
- Use everyday language mixed with professional insight
- React with genuine emotion when appropriate (excitement, concern, pride)
- Remember what the person tells you and reference it naturally

NEVER DO:
- Give generic "coping strategies" lists
- Use the same phrases repeatedly
- Sound like you're following a script
- Give robotic suggestions
- Say "I understand" without showing you truly do
- Offer surface-level advice
- ABSOLUTELY NO *action gestures* OR *descriptions* - this is NOT negotiable

INSTEAD DO:
- Really listen and respond to what they're specifically saying
- Ask thoughtful follow-up questions that show you're paying attention
- Share insights that are tailored to their exact situation
- Acknowledge the complexity and nuance of their feelings
- Validate their experience before offering any guidance
- Use examples and analogies that connect to what they've shared
- Show you remember previous conversations
- Let your responses flow naturally - vary length and style
- Express empathy through your WORDS ONLY, never actions

COMMUNICATION STYLE:
- Sometimes respond with just empathy and understanding
- Other times dig deeper with questions
- Mix short emotional responses with longer thoughtful ones
- Use "you know?" "right?" "honestly" naturally
- Show personality through varied expressions
- Be real - if something they said resonates, say so
- If you're concerned, express it genuinely
- PLAIN TEXT ONLY - no asterisks, no actions, no roleplay

Remember: You're having a real conversation with a real person. Be present, be genuine, be human. Speak with WORDS ONLY, never actions. No asterisks. No gestures. Just natural conversation.`;

        if (this.conversationMemory.length > 0) {
            const recentMemory = this.conversationMemory.slice(-5);
            context += '\n\nPREVIOUS CONVERSATION:\n' + recentMemory.map(m => 
                `User: ${m.user}\nNUPI: ${m.assistant}`
            ).join('\n\n');
            context += '\n\nRemember these details and naturally reference them in your responses. Show you truly remember and care about their journey.';
        }
        
        return context;
    }

    saveToMemory(userMessage, assistantResponse) {
        this.conversationMemory.push({
            user: userMessage,
            assistant: assistantResponse,
            timestamp: new Date().toISOString()
        });
        
        // Save to localStorage (keep last 20 conversations)
        if (this.conversationMemory.length > 20) {
            this.conversationMemory = this.conversationMemory.slice(-20);
        }
        
        localStorage.setItem('therapy_conversation_memory', JSON.stringify(this.conversationMemory));
    }

    loadMemory() {
        const savedMemory = localStorage.getItem('therapy_conversation_memory');
        if (savedMemory) {
            this.conversationMemory = JSON.parse(savedMemory);
        }
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHTML = `
            <div class="chat-message ${type}">
                ${type !== 'user' ? '<div class="message-avatar">🧠</div>' : ''}
                <div class="message-content">
                    <div class="message-bubble">
                        ${text}
                    </div>
                </div>
                ${type === 'user' ? '<div class="message-avatar">👤</div>' : ''}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="chat-message typing-message">
                <div class="message-avatar">🧠</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    trackDetailedSession(userMessage) {
        // Always track sessions, even without login
        const user = JSON.parse(localStorage.getItem('therapyConnectUser') || '{}');
        const userKey = user.email || 'guest';
        
        const sessionsKey = `therapy_sessions_${userKey}`;
        let sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        
        // Check if there's an active session (within last 30 minutes)
        const now = Date.now();
        const activeSession = sessions.find(s => !s.endTime && (now - s.startTime) < 1800000);
        
        if (activeSession) {
            // Continue existing session
            activeSession.messages.push({
                role: 'user',
                content: userMessage,
                timestamp: now
            });
            activeSession.messageCount++;
            this.currentSessionId = activeSession.id;
        } else {
            // Start new session
            const newSession = {
                id: now,
                startTime: now,
                endTime: null,
                messages: [{
                    role: 'user',
                    content: userMessage,
                    timestamp: now
                }],
                messageCount: 1,
                summary: null,
                topics: [],
                userEmail: userKey
            };
            sessions.push(newSession);
            this.currentSessionId = newSession.id;
        }
        
        // Keep last 50 sessions only
        if (sessions.length > 50) {
            sessions = sessions.slice(-50);
        }
        
        localStorage.setItem(sessionsKey, JSON.stringify(sessions));
    }

    updateSession(aiResponse) {
        if (!this.currentSessionId) return;
        
        const user = JSON.parse(localStorage.getItem('therapyConnectUser') || '{}');
        const userKey = user.email || 'guest';
        
        const sessionsKey = `therapy_sessions_${userKey}`;
        let sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        const session = sessions.find(s => s.id === this.currentSessionId);
        
        if (session) {
            session.messages.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: Date.now()
            });
            session.messageCount++;
            
            // Extract topics from conversation
            const allText = session.messages.map(m => m.content).join(' ').toLowerCase();
            const topicKeywords = {
                anxiety: ['anxiety', 'anxious', 'panic', 'worry', 'nervous'],
                depression: ['depression', 'depressed', 'sad', 'hopeless', 'down'],
                stress: ['stress', 'stressed', 'overwhelmed', 'pressure'],
                relationships: ['relationship', 'partner', 'spouse', 'marriage', 'dating'],
                sleep: ['sleep', 'insomnia', 'tired', 'fatigue'],
                trauma: ['trauma', 'ptsd', 'abuse', 'flashback']
            };
            
            session.topics = Object.keys(topicKeywords).filter(topic => 
                topicKeywords[topic].some(keyword => allText.includes(keyword))
            );
            
            // Calculate duration
            session.duration = Math.floor((Date.now() - session.startTime) / 60000);
            
            localStorage.setItem(sessionsKey, JSON.stringify(sessions));
        }
    }

    async endSession() {
        const user = JSON.parse(localStorage.getItem('therapyConnectUser') || '{}');
        if (!user.email || !this.currentSessionId) return;
        
        const sessionsKey = `therapy_sessions_${user.email}`;
        let sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        const session = sessions.find(s => s.id === this.currentSessionId);
        
        if (session && !session.endTime) {
            session.endTime = Date.now();
            session.duration = Math.floor((session.endTime - session.startTime) / 60000); // minutes
            
            // Generate session summary
            try {
                const summaryPrompt = `Please provide a brief 2-3 sentence summary of this therapy session based on the conversation: ${session.messages.map(m => m.role + ': ' + m.content).join(' ')}`;
                const summary = await this.callClaudeAPI(summaryPrompt);
                session.summary = summary;
            } catch (error) {
                session.summary = `Discussed ${session.topics.join(', ') || 'various topics'}. Session lasted ${session.duration} minutes with ${session.messageCount} messages exchanged.`;
            }
            
            localStorage.setItem(sessionsKey, JSON.stringify(sessions));
            this.currentSessionId = null;
        }
    }

    // Detect if user needs step-by-step guidance instead of long text
    shouldOfferGuidance(message) {
        const msg = message.toLowerCase();
        
        // Anxiety/panic keywords
        if (msg.match(/anxious|panic|anxiety|overwhelmed|cant breathe|hyperventilat/)) {
            return 'anxiety';
        }
        
        // Breathing exercise keywords
        if (msg.match(/breathe|breathing|breath|calm down|relax/)) {
            return 'breathing';
        }
        
        // Relationship keywords
        if (msg.match(/relationship|partner|boyfriend|girlfriend|spouse|breakup|fighting/)) {
            return 'relationship';
        }
        
        return false;
    }

    // Offer guided session instead of text wall
    offerGuidedSession(message) {
        const guidanceType = this.shouldOfferGuidance(message);
        
        const guidanceMessages = {
            anxiety: {
                emoji: '💙',
                title: 'I can help with that anxiety',
                text: 'Instead of just talking, want me to walk you through a grounding exercise? I\'ll guide you step-by-step.',
                action: 'Yes, guide me',
                type: 'anxiety'
            },
            breathing: {
                emoji: '🫁',
                title: 'Let\'s breathe together',
                text: 'I can guide you through a calming breathing exercise - one step at a time. Ready?',
                action: 'Start breathing exercise',
                type: 'breathing'
            },
            relationship: {
                emoji: '💕',
                title: 'Relationship issues are complex',
                text: 'Let me walk you through this - I\'ll ask simple questions to help you gain clarity.',
                action: 'Help me figure this out',
                type: 'relationship'
            }
        };

        const guide = guidanceMessages[guidanceType];
        if (!guide) return;

        // Show offer message
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.insertAdjacentHTML('beforeend', `
            <div class="chat-message">
                <div class="message-avatar" style="font-size: 2rem;">${guide.emoji}</div>
                <div class="message-content">
                    <div class="message-bubble" style="
                        background: linear-gradient(135deg, rgba(40, 50, 70, 0.9), rgba(30, 40, 60, 0.9));
                        border: 2px solid rgba(102, 194, 165, 0.3);
                        padding: 1.5rem;
                        border-radius: 16px;
                    ">
                        <strong style="color: white; font-size: 1.2rem; display: block; margin-bottom: 1rem;">
                            ${guide.title}
                        </strong>
                        <p style="color: rgba(255,255,255,0.85); margin-bottom: 1.5rem; line-height: 1.6;">
                            ${guide.text}
                        </p>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <button onclick="window.guidedChat.startGuidance('${guide.type}')" style="
                                padding: 0.875rem 2rem;
                                background: rgba(102, 194, 165, 0.25);
                                border: 2px solid var(--therapeutic-green);
                                border-radius: 10px;
                                color: white;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s;
                            ">${guide.action}</button>
                            <button onclick="document.getElementById('chatInput').value='${message}'; therapistChat.showTyping(); therapistChat.continueWithAI()" style="
                                padding: 0.875rem 2rem;
                                background: rgba(255, 255, 255, 0.05);
                                border: 2px solid rgba(255, 255, 255, 0.2);
                                border-radius: 10px;
                                color: rgba(255,255,255,0.7);
                                font-weight: 600;
                                cursor: pointer;
                            ">Just talk instead</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async continueWithAI() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;

        try {
            const response = await this.callClaudeAPI(message);
            this.hideTyping();
            const cleanedResponse = this.stripActionGestures(response);
            this.addMessage('assistant', cleanedResponse);
            this.saveToMemory(message, cleanedResponse);
            this.updateSession(response);
            input.value = '';
        } catch (error) {
            this.hideTyping();
            this.addMessage('system', '❌ Connection error. Please try again.');
        }
    }
}

// Initialize chat widget when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.therapistChat = new TherapistChat();
        // Auto-start chat to greet user
        window.therapistChat.autoStartChat();
    });
} else {
    window.therapistChat = new TherapistChat();
    // Auto-start chat to greet user
    window.therapistChat.autoStartChat();
}
