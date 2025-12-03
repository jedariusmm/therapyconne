// Interactive Yoga Guide System with Enhanced Chat Integration

const poseGuides = {
    mountain: {
        name: '🏔️ Mountain Pose (Tadasana)',
        duration: 180,
        animation: 'mountain-pose',
        steps: [
            'Stand with feet hip-width apart, weight evenly distributed',
            'Let your arms hang naturally at your sides, palms facing forward',
            'Engage your thighs and lift your kneecaps',
            'Lengthen your spine, lifting through the crown of your head',
            'Roll shoulders back and down, opening your chest',
            'Take deep breaths, feeling grounded and stable like a mountain',
            'Hold this pose, feeling strength and stability in your body'
        ],
        nupiPrompt: 'Guide me through Mountain Pose step by step. Help me understand proper alignment and breathing. Be encouraging and remind me to stay present.'
    },
    tree: {
        name: '🌳 Tree Pose (Vrksasana)',
        duration: 60,
        animation: 'tree-pose',
        steps: [
            'Start in Mountain Pose, grounding through your left foot',
            'Shift weight to your left leg, finding your balance',
            'Place right foot on inner left thigh (or calf, not knee)',
            'Bring hands to heart center in prayer position',
            'Once balanced, raise arms overhead like branches',
            'Find a focal point to help maintain balance',
            'Breathe deeply, swaying gently like a tree in the wind',
            'Hold for 30 seconds, then switch sides'
        ],
        nupiPrompt: 'Guide me through Tree Pose. Help me with balance, remind me to breathe, and be patient if I wobble. Encourage me throughout the practice.'
    },
    child: {
        name: '🧒 Child\'s Pose (Balasana)',
        duration: 300,
        animation: 'child-pose',
        steps: [
            'Kneel on your mat with knees hip-width or wider',
            'Sit back on your heels, keeping them together',
            'Fold forward, bringing your forehead to the mat',
            'Extend arms forward or rest them alongside your body',
            'Let your belly rest between your thighs',
            'Breathe deeply into your back body',
            'Release all tension, surrendering to the earth',
            'Stay as long as feels comfortable, this is YOUR resting pose'
        ],
        nupiPrompt: 'Guide me through Child\'s Pose as a restorative rest. Help me release tension and anxiety. Remind me this is a safe space to let go.'
    },
    warrior: {
        name: '⚔️ Warrior I (Virabhadrasana I)',
        duration: 60,
        animation: 'warrior-pose',
        steps: [
            'Start in Mountain Pose at the front of your mat',
            'Step left foot back about 3-4 feet',
            'Turn left foot out 45 degrees for stability',
            'Bend right knee to 90 degrees, keeping it over ankle',
            'Square your hips forward as much as possible',
            'Raise arms overhead, palms facing each other',
            'Lift through your chest, gazing forward or up',
            'Feel strong and powerful, hold for 30 seconds each side'
        ],
        nupiPrompt: 'Guide me through Warrior I Pose. Help me build confidence and inner strength. Remind me I am powerful and capable.'
    },
    catcow: {
        name: '🐱 Cat-Cow (Marjaryasana-Bitilasana)',
        duration: 180,
        animation: 'catcow-pose',
        steps: [
            'Start on hands and knees in tabletop position',
            'Align wrists under shoulders, knees under hips',
            'Inhale: Drop belly, lift chest and tailbone (Cow)',
            'Exhale: Round spine, tuck chin and tailbone (Cat)',
            'Flow between these poses with your breath',
            'Move slowly and mindfully, syncing breath with movement',
            'Feel your spine undulating like a wave',
            'Continue for 1-3 minutes, warming up your spine'
        ],
        nupiPrompt: 'Guide me through Cat-Cow flow. Help me sync my breath with movement. Remind me to move slowly and mindfully.'
    },
    corpse: {
        name: '💤 Corpse Pose (Savasana)',
        duration: 600,
        animation: 'corpse-pose',
        steps: [
            'Lie flat on your back, legs extended, arms at sides',
            'Let your feet fall open naturally',
            'Place arms slightly away from body, palms facing up',
            'Close your eyes and soften your entire body',
            'Release tension from face, jaw, shoulders',
            'Let your breath flow naturally, no effort needed',
            'Scan your body, releasing any remaining tension',
            'Allow yourself to completely let go and rest',
            'Stay for 5-15 minutes in total relaxation'
        ],
        nupiPrompt: 'Guide me into deep relaxation with Savasana. Use a calming voice to help me release all tension. Lead me through a full body scan.'
    },
    breathing: {
        name: '🫁 Deep Breathing Exercise',
        duration: 300,
        animation: 'breathing',
        steps: [
            'Sit comfortably or lie down in a quiet space',
            'Close your eyes and bring attention to your breath',
            'Inhale slowly through nose for count of 4',
            'Hold your breath gently for count of 4',
            'Exhale slowly through mouth for count of 6',
            'Pause briefly before next inhale',
            'Continue this pattern: 4-4-6 breathing',
            'Notice your body relaxing with each exhale',
            'Practice for 3-10 minutes until you feel calm'
        ],
        nupiPrompt: 'Guide me through a deep breathing exercise for anxiety relief. Count with me: inhale 1-2-3-4, hold, exhale 1-2-3-4-5-6. Be calm and soothing.'
    },
    sun: {
        name: '☀️ Sun Salutation (Surya Namaskar)',
        duration: 300,
        animation: 'sun-pose',
        steps: [
            'Start in Mountain Pose, hands at heart center',
            'Inhale: Raise arms overhead, slight backbend',
            'Exhale: Fold forward, hands toward floor',
            'Inhale: Halfway lift, lengthen spine',
            'Exhale: Step or jump back to plank',
            'Lower down slowly (chaturanga)',
            'Inhale: Upward dog or cobra',
            'Exhale: Downward facing dog, hold 5 breaths',
            'Step or jump feet forward, fold',
            'Inhale: Rise up, arms overhead',
            'Exhale: Return to Mountain Pose',
            'Repeat 3-5 rounds, flowing with breath'
        ],
        nupiPrompt: 'Guide me through Sun Salutation flow. Call out each pose and remind me to breathe. Help me move mindfully through the sequence.'
    },
    meditation: {
        name: '🧘 Seated Meditation',
        duration: 600,
        animation: 'meditation-pose',
        steps: [
            'Sit comfortably on cushion or chair, spine tall',
            'Cross your legs or place feet flat on floor',
            'Rest hands on knees or in lap, palms up',
            'Gently close your eyes or soften your gaze',
            'Take 3 deep breaths to settle in',
            'Let your breath return to its natural rhythm',
            'Notice thoughts arise without judgment',
            'Gently return attention to your breath',
            'If mind wanders, that\'s okay, just come back',
            'Sit for 5-20 minutes in quiet awareness'
        ],
        nupiPrompt: 'Guide me through seated meditation. Help me stay present when my mind wanders. Remind me there\'s no wrong way to meditate.'
    }
};

let currentPose = null;
let poseTimer = null;
let poseTimeRemaining = 0;
let poseTimerPaused = false;
let currentStep = 0;

// Open Interactive Pose Guide
function openPoseGuide(poseId) {
    currentPose = poseGuides[poseId];
    if (!currentPose) return;

    const modal = document.getElementById('poseModal');
    const title = document.getElementById('poseTitle');
    const timer = document.getElementById('poseTimer');
    const animation = document.getElementById('guideAnimation');
    const steps = document.getElementById('guideSteps');

    // Set title
    title.textContent = currentPose.name;

    // Reset timer
    poseTimeRemaining = currentPose.duration;
    updateTimerDisplay();
    currentStep = 0;

    // Set animation
    animation.innerHTML = `<div class="yoga-figure ${currentPose.animation}"></div>`;
    if (poseId === 'breathing') {
        animation.innerHTML = `
            <div class="breathing-circle"></div>
            <div class="breathing-instruction">Follow the circle</div>
        `;
    }

    // Build steps
    let stepsHTML = '';
    currentPose.steps.forEach((step, index) => {
        stepsHTML += `
            <div class="step ${index === 0 ? 'active' : ''}" data-step="${index}">
                <span class="step-number">${index + 1}</span>
                <span>${step}</span>
            </div>
        `;
    });
    steps.innerHTML = stepsHTML;

    // Reset buttons
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';

    // Show modal
    modal.classList.add('active');

    // Auto-open chat and send NUPI the guide prompt
    setTimeout(() => {
        openChatForGuide(currentPose.nupiPrompt);
    }, 500);
}

// Close Pose Guide
function closePoseGuide() {
    const modal = document.getElementById('poseModal');
    modal.classList.remove('active');
    
    if (poseTimer) {
        clearInterval(poseTimer);
        poseTimer = null;
    }

    currentPose = null;
    poseTimeRemaining = 0;
    currentStep = 0;
}

// Start Pose Timer
function startPoseTimer() {
    if (poseTimerPaused) {
        // Resume
        poseTimerPaused = false;
    } else {
        // Start fresh
        poseTimeRemaining = currentPose.duration;
        currentStep = 0;
    }

    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';

    poseTimer = setInterval(() => {
        poseTimeRemaining--;
        updateTimerDisplay();

        // Progress through steps
        const stepInterval = Math.floor(currentPose.duration / currentPose.steps.length);
        const newStep = Math.floor((currentPose.duration - poseTimeRemaining) / stepInterval);
        
        if (newStep !== currentStep && newStep < currentPose.steps.length) {
            currentStep = newStep;
            updateActiveStep();
        }

        // Timer complete
        if (poseTimeRemaining <= 0) {
            clearInterval(poseTimer);
            poseTimer = null;
            completePose();
        }
    }, 1000);
}

// Pause Pose Timer
function pausePoseTimer() {
    poseTimerPaused = true;
    clearInterval(poseTimer);
    poseTimer = null;

    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('startBtn').textContent = '▶ Resume';
    document.getElementById('pauseBtn').style.display = 'none';
}

// Update Timer Display
function updateTimerDisplay() {
    const minutes = Math.floor(poseTimeRemaining / 60);
    const seconds = poseTimeRemaining % 60;
    const timerEl = document.getElementById('poseTimer');
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update Active Step Highlight
function updateActiveStep() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === currentStep) {
            step.classList.add('active');
            step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            step.classList.remove('active');
        }
    });
}

// Complete Pose
function completePose() {
    const modal = document.getElementById('poseModal');
    const title = document.getElementById('poseTitle');
    
    title.innerHTML = `✅ ${currentPose.name} - Complete!`;
    
    // Celebration message
    if (window.therapistChat) {
        setTimeout(() => {
            window.therapistChat.addMessage('system', `🎉 Amazing work! You completed ${currentPose.name}. How do you feel?`);
            expandChatForFeedback();
        }, 500);
    }

    document.getElementById('startBtn').textContent = '↻ Restart';
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
}

// Ask NUPI During Practice - USE GUIDED CHAT SYSTEM + AVATAR DEMONSTRATION
function askNUPI() {
    if (!currentPose) return;
    
    // Get the pose type/id from current pose
    const poseTypeMap = {
        '🏔️ Mountain Pose (Tadasana)': 'mountain',
        '🌳 Tree Pose (Vrksasana)': 'tree',
        '🧒 Child\'s Pose (Balasana)': 'child',
        '⚔️ Warrior I (Virabhadrasana I)': 'warrior',
        '🐱 Cat-Cow (Marjaryasana-Bitilasana)': 'catcow',
        '💤 Corpse Pose (Savasana)': 'corpse',
        '🫁 Deep Breathing Exercise': 'breathing',
        '☀️ Sun Salutation (Surya Namaskar)': 'sun',
        '🧘 Seated Meditation': 'meditation'
    };
    
    const poseType = poseTypeMap[currentPose.name] || 'breathing';
    
    // Make NUPI avatar demonstrate the pose!
    if (window.therapistChat && window.therapistChat.avatar) {
        window.therapistChat.avatar.setState(poseType);
    }
    
    // Open chat if needed
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow || !chatWindow.classList.contains('active')) {
        if (window.therapistChat) {
            window.therapistChat.toggleChat();
        }
    }
    
    // Use guided chat system for step-by-step guidance
    setTimeout(() => {
        if (window.guidedChat && window.guidedChat.startGuidance) {
            window.guidedChat.startGuidance(poseType);
        } else {
            // Fallback to regular chat if guided system not available
            if (window.therapistChat) {
                const message = `I'm practicing ${currentPose.name}. ${currentPose.nupiPrompt}`;
                window.therapistChat.quickMessage(message);
            }
        }
    }, 300);
}

// Open and Expand Chat for Guided Exercise
function openChatForGuide(prompt) {
    if (!window.therapistChat) {
        console.error('Chat not initialized yet');
        return;
    }

    const chatWindow = document.getElementById('chatWindow');
    
    // Open chat if closed
    if (!chatWindow.classList.contains('active')) {
        window.therapistChat.toggleChat();
    }

    // EXPAND chat to larger size for guided experience
    setTimeout(() => {
        expandChatForGuide();
        
        // Send the guided prompt
        if (prompt) {
            setTimeout(() => {
                window.therapistChat.quickMessage(prompt);
            }, 500);
        }
    }, 300);
}

// Expand Chat for Interactive Guidance
function expandChatForGuide() {
    const chatWindow = document.getElementById('chatWindow');
    
    // Add guided mode class for smooth transition
    chatWindow.classList.add('guided-mode');
    
    // Add visual indicator that this is guided mode
    const header = chatWindow.querySelector('.chat-header');
    if (header && !header.querySelector('.guide-mode-badge')) {
        header.insertAdjacentHTML('beforeend', `
            <div class="guide-mode-badge" style="
                position: absolute;
                top: -10px;
                right: 60px;
                background: linear-gradient(135deg, #ff9500, #ff6b00);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
                box-shadow: 0 3px 10px rgba(255, 149, 0, 0.5);
            ">🎯 GUIDED MODE</div>
        `);
    }
}

// Expand Chat for Feedback After Exercise
function expandChatForFeedback() {
    const chatWindow = document.getElementById('chatWindow');
    
    // Keep guided mode active
    chatWindow.classList.add('guided-mode');
    
    // Update badge
    const badge = chatWindow.querySelector('.guide-mode-badge');
    if (badge) {
        badge.textContent = '💬 FEEDBACK';
        badge.style.background = 'linear-gradient(135deg, #66c2a5, #8dd3c7)';
    }
}

// Restore Normal Chat Size
function restoreChatSize() {
    const chatWindow = document.getElementById('chatWindow');
    
    // Remove guided mode class for smooth transition back
    chatWindow.classList.remove('guided-mode');
    
    // Remove guide mode badge
    const badge = chatWindow.querySelector('.guide-mode-badge');
    if (badge) {
        badge.remove();
    }
}

// Auto-restore chat size when closed
if (document.getElementById('chatClose')) {
    document.getElementById('chatClose').addEventListener('click', () => {
        setTimeout(restoreChatSize, 300);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('poseModal').classList.contains('active')) {
        closePoseGuide();
    }
    
    if (e.key === ' ' && document.getElementById('poseModal').classList.contains('active')) {
        e.preventDefault();
        if (poseTimer) {
            pausePoseTimer();
        } else {
            startPoseTimer();
        }
    }
});

// Track pose completion
function trackPoseCompletion(poseName) {
    const completions = JSON.parse(localStorage.getItem('yoga_completions') || '[]');
    completions.push({
        pose: poseName,
        timestamp: new Date().toISOString(),
        duration: currentPose.duration
    });
    
    // Keep last 100 completions
    if (completions.length > 100) {
        completions.shift();
    }
    
    localStorage.setItem('yoga_completions', JSON.stringify(completions));
}

// Update complete pose to track
const originalCompletePose = completePose;
completePose = function() {
    if (currentPose) {
        trackPoseCompletion(currentPose.name);
    }
    originalCompletePose();
};

console.log('🧘 Yoga Guide System Loaded - Interactive poses ready!');
