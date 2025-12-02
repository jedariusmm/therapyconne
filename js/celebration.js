// Celebration Effects - Balloons & Confetti
// Triggers on signup/subscription success

/**
 * Launch celebration balloons!
 */
function launchBalloons() {
    const colors = ['#667eea', '#764ba2', '#38ef7d', '#fa709a', '#fee140', '#4facfe'];
    const balloonCount = 15;
    
    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            createBalloon(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 150);
    }
}

/**
 * Create a single balloon
 */
function createBalloon(color) {
    const balloon = document.createElement('div');
    balloon.className = 'celebration-balloon';
    
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 200; // Side-to-side drift
    const duration = 3 + Math.random() * 2; // 3-5 seconds
    const size = 40 + Math.random() * 30; // 40-70px
    
    balloon.style.cssText = `
        position: fixed;
        left: ${startX}px;
        bottom: -100px;
        width: ${size}px;
        height: ${size * 1.2}px;
        background: ${color};
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        z-index: 99999;
        pointer-events: none;
        box-shadow: 
            inset -10px -10px 20px rgba(0, 0, 0, 0.2),
            0 10px 30px rgba(0, 0, 0, 0.3);
        animation: floatUp ${duration}s ease-out forwards;
        --drift: ${drift}px;
    `;
    
    // Add string
    const string = document.createElement('div');
    string.style.cssText = `
        position: absolute;
        bottom: -30px;
        left: 50%;
        width: 2px;
        height: 30px;
        background: rgba(255, 255, 255, 0.3);
        transform-origin: top;
        animation: stringWiggle ${duration}s ease-in-out infinite;
    `;
    balloon.appendChild(string);
    
    // Add shine
    const shine = document.createElement('div');
    shine.style.cssText = `
        position: absolute;
        top: 20%;
        left: 20%;
        width: 30%;
        height: 30%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
        border-radius: 50%;
    `;
    balloon.appendChild(shine);
    
    document.body.appendChild(balloon);
    
    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

/**
 * Launch confetti burst
 */
function launchConfetti() {
    const confettiCount = 100;
    const colors = ['#667eea', '#764ba2', '#38ef7d', '#fa709a', '#fee140', '#4facfe', '#ff6b6b'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
}

/**
 * Create a single confetti piece
 */
function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.className = 'celebration-confetti';
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 200 + Math.random() * 300;
    const endX = startX + Math.cos(angle) * velocity;
    const endY = startY + Math.sin(angle) * velocity;
    const rotation = Math.random() * 1080;
    const duration = 2 + Math.random();
    
    const shapes = ['square', 'circle', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    let shapeStyles = '';
    if (shape === 'circle') {
        shapeStyles = 'border-radius: 50%;';
    } else if (shape === 'triangle') {
        shapeStyles = `
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 10px solid ${color};
            background: transparent;
        `;
    }
    
    confetti.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: ${shape === 'triangle' ? '0' : '10px'};
        height: ${shape === 'triangle' ? '0' : '10px'};
        background: ${shape === 'triangle' ? 'transparent' : color};
        ${shapeStyles}
        z-index: 99999;
        pointer-events: none;
        opacity: 1;
        animation: confettiFall ${duration}s ease-out forwards;
        --endX: ${endX}px;
        --endY: ${endY}px;
        --rotation: ${rotation}deg;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000);
}

/**
 * Full celebration - balloons + confetti + message
 */
function celebrate(message = "🎉 Welcome to TherapyConnect!") {
    // Show success message
    showCelebrationMessage(message);
    
    // Launch effects
    launchBalloons();
    setTimeout(() => {
        launchConfetti();
    }, 500);
    
    // Play sound (optional - commented out for now)
    // playSuccessSound();
}

/**
 * Show celebration message
 */
function showCelebrationMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'celebration-message';
    messageDiv.innerHTML = `
        <div class="celebration-message-content">
            <h2>${message}</h2>
            <p>🎈 Your FREE 30-day trial starts now! 🎈</p>
        </div>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 3rem;
        border-radius: 20px;
        z-index: 100000;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: celebrationPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'celebrationFadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    }, 3000);
}

/**
 * Add celebration styles to document
 */
function addCelebrationStyles() {
    if (document.getElementById('celebration-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'celebration-styles';
    styles.textContent = `
        @keyframes floatUp {
            0% {
                bottom: -100px;
                transform: translateX(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                bottom: 110vh;
                transform: translateX(var(--drift)) rotate(15deg);
                opacity: 0.8;
            }
        }
        
        @keyframes stringWiggle {
            0%, 100% {
                transform: rotate(-5deg);
            }
            50% {
                transform: rotate(5deg);
            }
        }
        
        @keyframes confettiFall {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate(
                    calc(var(--endX) - ${window.innerWidth / 2}px),
                    calc(var(--endY) - ${window.innerHeight / 2}px + 500px)
                ) rotate(var(--rotation));
                opacity: 0;
            }
        }
        
        @keyframes celebrationPop {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }
        
        @keyframes celebrationFadeOut {
            to {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
            }
        }
        
        .celebration-message-content h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: white;
        }
        
        .celebration-message-content p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
        }
    `;
    
    document.head.appendChild(styles);
}

// Initialize styles when script loads
addCelebrationStyles();

// Export for use in other scripts
window.celebrate = celebrate;
window.launchBalloons = launchBalloons;
window.launchConfetti = launchConfetti;
