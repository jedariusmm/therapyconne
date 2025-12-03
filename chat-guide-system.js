// Step-by-Step Guided Chat System for NUPI Therapist
// Shows one helpful step at a time instead of overwhelming text walls

class GuidedChatSystem {
    constructor() {
        this.currentStep = 0;
        this.guidanceActive = false;
        this.guidanceType = null;
        this.autoAdvance = true; // Auto-progress through steps
        this.autoAdvanceDelay = 3000; // 3 seconds between steps
    }

    // Breathing Exercise Guidance (step-by-step)
    breathingGuide() {
        const steps = [
            {
                step: 1,
                emoji: "👋",
                title: "Welcome",
                text: "Let's do a breathing exercise together. Ready?",
                action: "Continue"
            },
            {
                step: 2,
                emoji: "🌊",
                title: "Find Your Position",
                text: "Sit comfortably with your feet on the floor.",
                action: "I'm Ready"
            },
            {
                step: 3,
                emoji: "👁️",
                title: "Close Your Eyes",
                text: "Gently close your eyes or soften your gaze.",
                action: "Eyes Closed"
            },
            {
                step: 4,
                emoji: "🫁",
                title: "Breathe In",
                text: "Breathe in slowly through your nose... 1, 2, 3, 4",
                timer: 4,
                action: "Done"
            },
            {
                step: 5,
                emoji: "⏸️",
                title: "Hold",
                text: "Hold your breath gently... 1, 2, 3, 4",
                timer: 4,
                action: "Done"
            },
            {
                step: 6,
                emoji: "💨",
                title: "Breathe Out",
                text: "Exhale slowly through your mouth... 1, 2, 3, 4, 5, 6",
                timer: 6,
                action: "Done"
            },
            {
                step: 7,
                emoji: "🔄",
                title: "Repeat?",
                text: "Great! Want to do another cycle?",
                action: "Yes, Again",
                action2: "I Feel Better"
            },
            {
                step: 8,
                emoji: "✨",
                title: "Well Done!",
                text: "You did great. How do you feel now?",
                action: "Much Better"
            }
        ];

        return steps;
    }

    // Yoga Pose Guidance - Complete All Poses
    yogaPoseGuide(poseName) {
        const poseGuides = {
            mountain: [
                { emoji: "⛰️", title: "Mountain Pose", text: "Stand tall with feet hip-width apart", action: "Ready" },
                { emoji: "👣", title: "Ground Down", text: "Feel your feet pressing firmly into the floor", action: "I Feel It" },
                { emoji: "🫴", title: "Arms at Sides", text: "Let arms hang naturally, palms facing forward", action: "Done" },
                { emoji: "🧘", title: "Lengthen Spine", text: "Imagine a string pulling you up from the crown of your head", timer: 10, action: "Got It" },
                { emoji: "💚", title: "Breathe Deep", text: "Take 3 slow, deep breaths. Feel grounded and stable", timer: 15, action: "Finished" },
                { emoji: "✨", title: "Beautiful!", text: "You completed Mountain Pose! Strong like a mountain.", action: "Done" }
            ],
            tree: [
                { emoji: "🌳", title: "Tree Pose", text: "Start in Mountain Pose, standing tall", action: "Ready" },
                { emoji: "👁️", title: "Find Focus", text: "Pick a spot in front of you to focus on", action: "Found It" },
                { emoji: "🦵", title: "Lift One Foot", text: "Lift right foot, place on left inner thigh or calf (not knee!)", action: "Balanced" },
                { emoji: "🙏", title: "Hands to Heart", text: "Bring hands to prayer position at chest center", action: "Got It" },
                { emoji: "🧘", title: "Hold Steady", text: "Breathe slowly. Sway gently like a tree in breeze", timer: 20, action: "Holding" },
                { emoji: "🌳", title: "Optional: Reach Up", text: "If stable, raise arms overhead like branches", action: "Did It" },
                { emoji: "✨", title: "Amazing Balance!", text: "Great work! Switch sides when ready", action: "Done" }
            ],
            child: [
                { emoji: "🧒", title: "Child's Pose", text: "Kneel on your mat with knees hip-width or wider", action: "Ready" },
                { emoji: "🪑", title: "Sit Back", text: "Sit back on your heels, keeping them together", action: "Seated" },
                { emoji: "🫳", title: "Fold Forward", text: "Fold forward, bringing forehead to the mat", action: "Folded" },
                { emoji: "🤲", title: "Arms Position", text: "Extend arms forward or rest them alongside your body", action: "Comfortable" },
                { emoji: "😮‍💨", title: "Breathe Into Back", text: "Feel your breath expanding your back body", timer: 15, action: "Breathing" },
                { emoji: "🧘", title: "Release Tension", text: "Let go of all tension. This is YOUR resting pose", timer: 30, action: "Relaxed" },
                { emoji: "✨", title: "Perfect Rest", text: "Stay as long as you need. You're safe here.", action: "Done" }
            ],
            warrior: [
                { emoji: "⚔️", title: "Warrior I", text: "Start at the front of your mat in Mountain Pose", action: "Ready" },
                { emoji: "👣", title: "Step Back", text: "Step left foot back 3-4 feet, turn it out 45 degrees", action: "Stepped" },
                { emoji: "🦵", title: "Bend Front Knee", text: "Bend right knee to 90 degrees, keep it over ankle", action: "Bent" },
                { emoji: "💪", title: "Square Hips", text: "Try to square your hips forward as much as possible", action: "Squared" },
                { emoji: "🙌", title: "Raise Arms", text: "Raise arms overhead, palms facing each other", action: "Arms Up" },
                { emoji: "🧘", title: "Lift Chest", text: "Lift through your chest, gaze forward or up", timer: 20, action: "Holding" },
                { emoji: "✨", title: "Powerful!", text: "Feel your inner warrior! Switch sides when ready", action: "Done" }
            ],
            catcow: [
                { emoji: "🐱", title: "Cat-Cow Flow", text: "Start on hands and knees in tabletop position", action: "Ready" },
                { emoji: "📐", title: "Align Body", text: "Wrists under shoulders, knees under hips", action: "Aligned" },
                { emoji: "🐮", title: "Cow Pose", text: "Inhale: Drop belly, lift chest and tailbone up", timer: 4, action: "Cow" },
                { emoji: "🐱", title: "Cat Pose", text: "Exhale: Round spine, tuck chin and tailbone", timer: 4, action: "Cat" },
                { emoji: "🌊", title: "Flow With Breath", text: "Continue: Inhale Cow, Exhale Cat. Move slowly", timer: 30, action: "Flowing" },
                { emoji: "🧘", title: "Feel The Wave", text: "Your spine undulates like a wave. So smooth!", timer: 20, action: "Feeling It" },
                { emoji: "✨", title: "Spine Happy!", text: "Your spine thanks you! Feel more mobile?", action: "Done" }
            ],
            corpse: [
                { emoji: "💤", title: "Corpse Pose (Savasana)", text: "Lie flat on your back, legs extended", action: "Ready" },
                { emoji: "�", title: "Let Feet Fall", text: "Let your feet fall open naturally to the sides", action: "Relaxed" },
                { emoji: "🫳", title: "Arms Away", text: "Place arms slightly away from body, palms facing up", action: "Positioned" },
                { emoji: "😌", title: "Close Eyes", text: "Gently close your eyes and soften your face", action: "Eyes Closed" },
                { emoji: "😮‍💨", title: "Natural Breath", text: "Let your breath flow naturally, no effort needed", timer: 20, action: "Breathing" },
                { emoji: "🧘", title: "Body Scan", text: "Notice each body part from toes to head, releasing tension", timer: 40, action: "Scanning" },
                { emoji: "🌊", title: "Total Surrender", text: "Let go completely. You have nowhere to be, nothing to do", timer: 60, action: "Surrendered" },
                { emoji: "✨", title: "Deep Rest", text: "Stay as long as you need. This is true relaxation.", action: "Done" }
            ],
            sun: [
                { emoji: "☀️", title: "Sun Salutation", text: "Start in Mountain Pose at front of mat", action: "Ready" },
                { emoji: "🙏", title: "Hands to Heart", text: "Bring hands to prayer position at your chest", action: "Centered" },
                { emoji: "🙌", title: "Reach Up", text: "Inhale: Raise arms overhead, slight backbend", timer: 3, action: "Reached" },
                { emoji: "�", title: "Fold Forward", text: "Exhale: Fold forward, hands toward floor", timer: 3, action: "Folded" },
                { emoji: "🦵", title: "Halfway Lift", text: "Inhale: Lift halfway, lengthen spine flat", timer: 3, action: "Lifted" },
                { emoji: "🏋️", title: "Plank", text: "Exhale: Step or jump back to plank position", action: "In Plank" },
                { emoji: "🐍", title: "Lower Down", text: "Lower slowly to mat (or knees-chest-chin)", action: "Lowered" },
                { emoji: "🐕", title: "Upward Dog", text: "Inhale: Lift chest, straighten arms (or Cobra)", timer: 3, action: "Up Dog" },
                { emoji: "⛰️", title: "Downward Dog", text: "Exhale: Press back to downward dog. Hold 5 breaths", timer: 25, action: "Down Dog" },
                { emoji: "🦶", title: "Step Forward", text: "Step or jump feet to hands at front of mat", action: "Stepped" },
                { emoji: "🙌", title: "Rise Up", text: "Inhale: Sweep arms up and rise to standing", timer: 3, action: "Rising" },
                { emoji: "✨", title: "Complete!", text: "Exhale: Return to Mountain. One full sun salutation!", action: "Done" }
            ],
            meditation: [
                { emoji: "🧘", title: "Seated Meditation", text: "Sit comfortably on cushion or chair", action: "Ready" },
                { emoji: "🪑", title: "Find Your Seat", text: "Sit tall with spine straight but relaxed", action: "Seated" },
                { emoji: "🦵", title: "Cross Legs", text: "Cross your legs comfortably (or feet flat if on chair)", action: "Comfortable" },
                { emoji: "🤲", title: "Rest Hands", text: "Rest hands on knees or in lap, palms up or down", action: "Resting" },
                { emoji: "👁️", title: "Close Eyes", text: "Gently close your eyes or soften your gaze downward", action: "Eyes Closed" },
                { emoji: "😮‍💨", title: "Three Deep Breaths", text: "Take 3 slow, deep breaths to settle in", timer: 15, action: "Breathed" },
                { emoji: "🌊", title: "Natural Breathing", text: "Let breath return to its natural, easy rhythm", timer: 20, action: "Breathing" },
                { emoji: "💭", title: "Notice Thoughts", text: "When thoughts arise, notice them without judgment", timer: 30, action: "Noticing" },
                { emoji: "🎯", title: "Return to Breath", text: "Gently bring attention back to your breath", timer: 40, action: "Focused" },
                { emoji: "🧘", title: "Just Be", text: "Continue sitting in quiet awareness. No right or wrong", timer: 60, action: "Meditating" },
                { emoji: "✨", title: "Well Done", text: "Slowly open your eyes. How do you feel?", action: "Done" }
            ]
        };

        return poseGuides[poseName] || this.breathingGuide();
    }

    // Anxiety Help - Step by Step
    anxietyGuide() {
        return [
            { emoji: "💙", title: "I'm Here", text: "Anxiety is tough. Let's work through this together.", action: "OK" },
            { emoji: "🫁", title: "First: Breathe", text: "Take one slow, deep breath with me now", timer: 8, action: "Did It" },
            { emoji: "👁️", title: "Notice 5 Things", text: "Look around. Name 5 things you can see.", action: "Found 5" },
            { emoji: "✋", title: "Touch 4 Things", text: "Feel 4 different textures around you", action: "Touched 4" },
            { emoji: "👂", title: "Hear 3 Sounds", text: "Listen. What 3 sounds can you hear?", action: "Heard 3" },
            { emoji: "👃", title: "Smell 2 Scents", text: "Notice 2 things you can smell", action: "Got 2" },
            { emoji: "👅", title: "Taste 1 Thing", text: "What's one taste in your mouth right now?", action: "Noticed" },
            { emoji: "✨", title: "You're Present", text: "You just grounded yourself. How do you feel?", action: "Better" }
        ];
    }

    // Relationship Issue - Step by Step
    relationshipGuide() {
        return [
            { emoji: "💕", title: "Relationships Are Complex", text: "Let's break this down. What's the main issue?", action: "Tell You" },
            { emoji: "🤔", title: "Your Feelings", text: "How does this situation make YOU feel?", action: "Shared" },
            { emoji: "👥", title: "Their Perspective", text: "What might they be feeling or thinking?", action: "I See It" },
            { emoji: "💬", title: "Communication", text: "Have you told them how you feel?", action: "Yes", action2: "Not Yet" },
            { emoji: "🎯", title: "What You Want", text: "What outcome would make you feel better?", action: "Shared" },
            { emoji: "📝", title: "Next Step", text: "What's one small thing you can do today?", action: "I Know" },
            { emoji: "💪", title: "You've Got This", text: "You have clarity now. Ready to take action?", action: "Yes" }
        ];
    }

    // Show step in chat window
    showStep(guide, stepIndex) {
        const step = guide[stepIndex];
        if (!step) return null;

        const hasTimer = step.timer > 0;
        const timerHTML = hasTimer ? `
            <div class="step-timer" style="
                font-size: 3rem;
                color: var(--therapeutic-green);
                text-align: center;
                margin: 1.5rem 0;
                font-weight: 700;
                animation: pulse 1s infinite;
            " data-timer="${step.timer}">${step.timer}</div>
        ` : '';

        const action2HTML = step.action2 ? `
            <button class="step-action-btn" onclick="guidedChat.nextStep()" style="
                padding: 1rem 2rem;
                background: rgba(102, 194, 165, 0.15);
                border: 2px solid rgba(102, 194, 165, 0.5);
                border-radius: 12px;
                color: var(--therapeutic-green);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            ">${step.action2}</button>
        ` : '';

        return `
            <div class="chat-message guided-step" style="animation: slideInUp 0.5s ease;">
                <div class="message-avatar" style="font-size: 2.5rem;">${step.emoji}</div>
                <div class="message-content">
                    <div class="message-bubble" style="
                        background: linear-gradient(135deg, rgba(40, 50, 70, 0.9), rgba(30, 40, 60, 0.9));
                        border: 2px solid rgba(102, 194, 165, 0.3);
                        padding: 2rem;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    ">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: rgba(102, 194, 165, 0.2);
                                border: 2px solid var(--therapeutic-green);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: 700;
                                color: var(--therapeutic-green);
                            ">${step.step || stepIndex + 1}</div>
                            <h3 style="color: white; margin: 0; font-size: 1.5rem;">${step.title}</h3>
                        </div>
                        
                        <p style="color: rgba(255,255,255,0.9); font-size: 1.2rem; line-height: 1.8; margin: 0 0 2rem 0;">
                            ${step.text}
                        </p>
                        
                        ${timerHTML}
                        
                        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            ${step.action2 ? `
                                <button class="step-action-btn" onclick="guidedChat.nextStep(true)" style="
                                    padding: 1rem 2.5rem;
                                    background: rgba(102, 194, 165, 0.25);
                                    border: 2px solid var(--therapeutic-green);
                                    border-radius: 12px;
                                    color: white;
                                    font-weight: 600;
                                    font-size: 1.1rem;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                    box-shadow: 0 5px 20px rgba(102, 194, 165, 0.3);
                                ">${step.action}</button>
                                ${action2HTML}
                            ` : `
                                <div style="color: rgba(102, 194, 165, 0.7); font-size: 0.9rem; text-align: center; padding: 0.5rem;">
                                    <div style="display: inline-flex; align-items: center; gap: 0.5rem;">
                                        <span style="animation: blink 1.5s infinite;">⏳</span>
                                        <span>Auto-advancing...</span>
                                    </div>
                                    <div style="margin-top: 0.5rem;">
                                        <button onclick="guidedChat.nextStep(true)" style="
                                            padding: 0.5rem 1.5rem;
                                            background: transparent;
                                            border: 1px solid rgba(102, 194, 165, 0.5);
                                            border-radius: 8px;
                                            color: var(--therapeutic-green);
                                            font-size: 0.9rem;
                                            cursor: pointer;
                                            transition: all 0.3s;
                                        ">Skip Wait →</button>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                
                .step-action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(102, 194, 165, 0.5) !important;
                    background: rgba(102, 194, 165, 0.4) !important;
                }
            </style>
        `;
    }

    // Auto-start timer countdown
    startTimer(duration) {
        const timerEl = document.querySelector('.step-timer');
        if (!timerEl) return;

        let remaining = duration;
        const interval = setInterval(() => {
            remaining--;
            timerEl.textContent = remaining;
            
            if (remaining <= 0) {
                clearInterval(interval);
                timerEl.textContent = '✓';
                timerEl.style.color = 'var(--therapeutic-green)';
            }
        }, 1000);
    }

    nextStep(manualClick = false) {
        this.currentStep++;
        const guide = this.getCurrentGuide();
        
        if (this.currentStep < guide.length) {
            const stepHTML = this.showStep(guide, this.currentStep);
            const messagesDiv = document.getElementById('chatMessages');
            messagesDiv.insertAdjacentHTML('beforeend', stepHTML);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            
            // Start timer if step has one
            const step = guide[this.currentStep];
            if (step.timer) {
                setTimeout(() => this.startTimer(step.timer), 500);
            }
            
            // Auto-advance to next step after delay (unless it's a choice step)
            if (this.autoAdvance && !step.action2 && !manualClick) {
                const delay = step.timer ? (step.timer * 1000 + 2000) : this.autoAdvanceDelay;
                setTimeout(() => this.nextStep(false), delay);
            }
        } else {
            // Guidance complete
            this.completeGuidance();
        }
    }

    getCurrentGuide() {
        switch(this.guidanceType) {
            case 'breathing': return this.breathingGuide();
            case 'anxiety': return this.anxietyGuide();
            case 'relationship': return this.relationshipGuide();
            case 'tree': return this.yogaPoseGuide('tree');
            case 'mountain': return this.yogaPoseGuide('mountain');
            case 'child': return this.yogaPoseGuide('child');
            case 'warrior': return this.yogaPoseGuide('warrior');
            case 'catcow': return this.yogaPoseGuide('catcow');
            case 'corpse': return this.yogaPoseGuide('corpse');
            case 'sun': return this.yogaPoseGuide('sun');
            case 'meditation': return this.yogaPoseGuide('meditation');
            default: return this.breathingGuide();
        }
    }

    startGuidance(type) {
        this.guidanceType = type;
        this.currentStep = 0;
        this.guidanceActive = true;
        
        const stepHTML = this.showStep(this.getCurrentGuide(), 0);
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.innerHTML = stepHTML;
        
        // Expand chat window
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.add('guided-mode');
        }
        
        // Make NUPI avatar demonstrate the pose/exercise!
        if (window.therapistChat && window.therapistChat.avatar) {
            window.therapistChat.avatar.setState(type);
        }
        
        // Auto-advance after initial delay (first step)
        const firstStep = this.getCurrentGuide()[0];
        if (this.autoAdvance && !firstStep.action2) {
            const delay = firstStep.timer ? (firstStep.timer * 1000 + 2000) : this.autoAdvanceDelay;
            setTimeout(() => this.nextStep(false), delay);
        }
    }

    completeGuidance() {
        this.guidanceActive = false;
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.insertAdjacentHTML('beforeend', `
            <div class="chat-message">
                <div class="message-avatar">🎉</div>
                <div class="message-content">
                    <div class="message-bubble">
                        <strong>You completed the guided session!</strong><br><br>
                        How do you feel? Want to talk more or try something else?
                    </div>
                </div>
            </div>
        `);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Initialize
const guidedChat = new GuidedChatSystem();

// Expose to window for easy access
window.guidedChat = guidedChat;
