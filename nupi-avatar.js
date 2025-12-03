/**
 * NUPI Digital Avatar System
 * Advanced animated therapist avatar with realistic movements, gestures, and expressions
 */

class NUPIAvatar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        // Avatar state
        this.state = {
            emotion: 'calm',        // calm, happy, empathetic, concerned, thinking, encouraging
            action: 'idle',         // idle, talking, nodding, gesturing, listening, welcoming
            blinkTimer: 0,
            breathTimer: 0,
            gestureTimer: 0,
            talkingTimer: 0,
            isTalking: false,
            isBlinking: false,
            currentMessage: ''
        };
        
        // Animation parameters
        this.params = {
            headTilt: 0,
            headBob: 0,
            eyeOpenness: 1,
            mouthOpenness: 0,
            eyebrowPosition: 0,
            armPosition: 0,
            handGesture: 0,
            bodyLean: 0,
            breath: 0
        };
        
        // Target parameters for smooth transitions
        this.targets = { ...this.params };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.startAnimation();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 500;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.objectFit = 'contain';
        this.ctx = this.canvas.getContext('2d');
        
        // Clear any existing content
        if (this.container) {
            this.container.innerHTML = '';
            this.container.appendChild(this.canvas);
        }
    }
    
    // Main animation loop
    startAnimation() {
        const animate = () => {
            this.update();
            this.draw();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    // Update animation parameters
    update() {
        // Smooth interpolation
        for (let key in this.params) {
            this.params[key] += (this.targets[key] - this.params[key]) * 0.1;
        }
        
        // Breathing animation
        this.state.breathTimer += 0.02;
        this.params.breath = Math.sin(this.state.breathTimer) * 0.05;
        
        // Blinking
        this.state.blinkTimer++;
        if (this.state.blinkTimer > 180 && !this.state.isBlinking) {
            this.blink();
        }
        
        // Idle movements
        if (this.state.action === 'idle') {
            this.params.headTilt = Math.sin(this.state.breathTimer * 0.5) * 0.02;
            this.params.headBob = Math.sin(this.state.breathTimer * 0.3) * 0.01;
        }
        
        // Talking animation
        if (this.state.isTalking) {
            this.state.talkingTimer += 0.3;
            this.targets.mouthOpenness = Math.abs(Math.sin(this.state.talkingTimer)) * 0.4;
            this.targets.headBob = Math.sin(this.state.talkingTimer * 0.5) * 0.03;
        } else {
            this.targets.mouthOpenness = 0;
        }
        
        // Gesture animations
        if (this.state.action === 'welcoming') {
            this.state.gestureTimer += 0.05;
            this.params.armPosition = Math.sin(this.state.gestureTimer) * 0.3;
            if (this.state.gestureTimer > Math.PI * 2) {
                this.setState('idle');
            }
        }
        
        if (this.state.action === 'nodding') {
            this.state.gestureTimer += 0.15;
            this.params.headBob = Math.sin(this.state.gestureTimer) * 0.1;
            if (this.state.gestureTimer > Math.PI * 6) {
                this.setState('idle');
            }
        }
    }
    
    // Draw avatar
    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, w, h);
        
        // Center point
        const cx = w / 2;
        const cy = h / 2;
        
        ctx.save();
        
        // Apply body lean and breath
        ctx.translate(cx, cy);
        ctx.rotate(this.params.bodyLean);
        ctx.translate(0, this.params.breath * 20);
        
        // Draw body
        this.drawBody(ctx, 0, 100);
        
        // Draw arms
        this.drawArms(ctx, 0, 50);
        
        // Draw head
        ctx.save();
        ctx.translate(0, -120);
        ctx.rotate(this.params.headTilt);
        ctx.translate(0, this.params.headBob * 50);
        this.drawHead(ctx, 0, 0);
        ctx.restore();
        
        ctx.restore();
    }
    
    drawBody(ctx, x, y) {
        const emotion = this.state.emotion;
        
        // Torso
        ctx.fillStyle = this.getBodyColor();
        ctx.beginPath();
        ctx.ellipse(x, y, 80, 120, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Shirt/Professional attire
        ctx.fillStyle = '#4A90E2';
        ctx.beginPath();
        ctx.ellipse(x, y + 20, 75, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Collar
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 30, y - 20);
        ctx.lineTo(x, y - 10);
        ctx.lineTo(x + 30, y - 20);
        ctx.stroke();
    }
    
    drawArms(ctx, x, y) {
        const armPos = this.params.armPosition;
        
        // Left arm
        ctx.strokeStyle = this.getBodyColor();
        ctx.lineWidth = 25;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - 80, y);
        ctx.quadraticCurveTo(x - 120, y + 50 + armPos * 100, x - 100, y + 120 + armPos * 50);
        ctx.stroke();
        
        // Right arm
        ctx.beginPath();
        ctx.moveTo(x + 80, y);
        ctx.quadraticCurveTo(x + 120, y + 50 - armPos * 100, x + 100, y + 120 - armPos * 50);
        ctx.stroke();
        
        // Hands
        ctx.fillStyle = this.getBodyColor();
        ctx.beginPath();
        ctx.arc(x - 100, y + 120 + armPos * 50, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 100, y + 120 - armPos * 50, 18, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawHead(ctx, x, y) {
        // Head shape
        ctx.fillStyle = this.getBodyColor();
        ctx.beginPath();
        ctx.ellipse(x, y, 70, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.ellipse(x, y - 25, 75, 60, 0, 0, Math.PI, true);
        ctx.fill();
        
        // Draw facial features
        this.drawFace(ctx, x, y);
    }
    
    drawFace(ctx, x, y) {
        const emotion = this.state.emotion;
        const eyeOpen = this.params.eyeOpenness;
        const mouthOpen = this.params.mouthOpenness;
        const eyebrowPos = this.params.eyebrowPosition;
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        // Left eye
        ctx.beginPath();
        ctx.ellipse(x - 25, y - 10, 15, 20 * eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.ellipse(x + 25, y - 10, 15, 20 * eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        if (eyeOpen > 0.3) {
            ctx.fillStyle = '#2C3E50';
            ctx.beginPath();
            ctx.arc(x - 25, y - 10, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 25, y - 10, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupil highlights
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x - 22, y - 13, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 28, y - 13, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Eyebrows
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Eyebrow shapes based on emotion
        const eyebrowCurve = this.getEyebrowCurve(emotion);
        
        // Left eyebrow
        ctx.beginPath();
        ctx.moveTo(x - 40, y - 35 + eyebrowPos);
        ctx.quadraticCurveTo(x - 25, y - 38 + eyebrowPos + eyebrowCurve, x - 10, y - 35 + eyebrowPos);
        ctx.stroke();
        
        // Right eyebrow
        ctx.beginPath();
        ctx.moveTo(x + 10, y - 35 + eyebrowPos);
        ctx.quadraticCurveTo(x + 25, y - 38 + eyebrowPos + eyebrowCurve, x + 40, y - 35 + eyebrowPos);
        ctx.stroke();
        
        // Nose
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 15);
        ctx.moveTo(x - 5, y + 15);
        ctx.arc(x, y + 15, 5, Math.PI, Math.PI * 1.5);
        ctx.stroke();
        
        // Mouth - shapes based on emotion
        this.drawMouth(ctx, x, y + 35, emotion, mouthOpen);
    }
    
    drawMouth(ctx, x, y, emotion, openness) {
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        switch(emotion) {
            case 'happy':
                // Smile
                ctx.beginPath();
                ctx.arc(x, y - 10, 25, 0.3, Math.PI - 0.3);
                ctx.stroke();
                if (openness > 0.2) {
                    ctx.fillStyle = '#FFE0E0';
                    ctx.fill();
                }
                break;
                
            case 'empathetic':
            case 'calm':
                // Gentle smile
                ctx.beginPath();
                ctx.moveTo(x - 20, y);
                ctx.quadraticCurveTo(x, y + 5 + openness * 15, x + 20, y);
                ctx.stroke();
                break;
                
            case 'concerned':
                // Slight frown
                ctx.beginPath();
                ctx.moveTo(x - 20, y + 5);
                ctx.quadraticCurveTo(x, y - 5, x + 20, y + 5);
                ctx.stroke();
                break;
                
            case 'thinking':
                // Neutral/pursed
                ctx.beginPath();
                ctx.ellipse(x, y, 15, 8 + openness * 10, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'encouraging':
                // Big smile
                ctx.beginPath();
                ctx.arc(x, y - 15, 30, 0.2, Math.PI - 0.2);
                ctx.stroke();
                if (openness > 0.1) {
                    ctx.fillStyle = '#FFE0E0';
                    ctx.fill();
                }
                break;
                
            default:
                // Neutral
                ctx.beginPath();
                ctx.moveTo(x - 20, y);
                ctx.lineTo(x + 20, y);
                ctx.stroke();
        }
    }
    
    getEyebrowCurve(emotion) {
        switch(emotion) {
            case 'happy':
            case 'encouraging':
                return -3;
            case 'concerned':
                return 5;
            case 'thinking':
                return 0;
            case 'empathetic':
                return -1;
            default:
                return 0;
        }
    }
    
    getBodyColor() {
        return '#F4C7A8'; // Warm skin tone
    }
    
    // Animation triggers
    blink() {
        this.state.isBlinking = true;
        this.targets.eyeOpenness = 0;
        setTimeout(() => {
            this.targets.eyeOpenness = 1;
            this.state.isBlinking = false;
            this.state.blinkTimer = 0;
        }, 150);
    }
    
    startTalking(message) {
        this.state.isTalking = true;
        this.state.currentMessage = message;
        this.state.talkingTimer = 0;
        
        // Detect emotion from message
        this.detectEmotion(message);
    }
    
    stopTalking() {
        this.state.isTalking = false;
        this.targets.mouthOpenness = 0;
    }
    
    setState(action) {
        this.state.action = action;
        this.state.gestureTimer = 0;
        
        switch(action) {
            case 'welcoming':
                this.targets.armPosition = 0.5;
                this.setEmotion('happy');
                break;
            case 'listening':
                this.targets.headTilt = 0.05;
                this.setEmotion('empathetic');
                break;
            case 'nodding':
                this.setEmotion('encouraging');
                break;
            case 'thinking':
                this.targets.headTilt = -0.03;
                this.setEmotion('thinking');
                break;
            case 'idle':
                this.targets.headTilt = 0;
                this.targets.armPosition = 0;
                this.setEmotion('calm');
                break;
            
            // YOGA POSES - Avatar demonstrates poses!
            case 'mountain':
                this.targets.armPosition = 0; // Arms at sides
                this.targets.headTilt = 0;
                this.targets.bodyLean = 0;
                this.setEmotion('calm');
                break;
            case 'tree':
                this.targets.armPosition = 0.8; // Arms up like branches
                this.targets.bodyLean = 0.02; // Slight sway
                this.setEmotion('calm');
                break;
            case 'warrior':
                this.targets.armPosition = 0.9; // Arms raised strong
                this.targets.bodyLean = -0.05; // Warrior stance
                this.setEmotion('encouraging');
                break;
            case 'child':
                this.targets.armPosition = 0.3; // Arms forward
                this.targets.headBob = 0.1; // Head bowed
                this.setEmotion('calm');
                break;
            case 'meditation':
                this.targets.armPosition = 0.2; // Hands on lap
                this.targets.headTilt = 0;
                this.targets.eyeOpenness = 0.3; // Eyes half closed
                this.setEmotion('calm');
                break;
            case 'namaste':
                this.targets.armPosition = 0.4; // Hands at heart
                this.targets.headTilt = 0.03; // Slight bow
                this.setEmotion('happy');
                break;
            case 'breathing':
                this.targets.breath = 0.15; // Exaggerated breathing
                this.setEmotion('calm');
                break;
        }
    }
    
    setEmotion(emotion) {
        this.state.emotion = emotion;
        
        // Adjust eyebrow position based on emotion
        switch(emotion) {
            case 'happy':
            case 'encouraging':
                this.targets.eyebrowPosition = -2;
                break;
            case 'concerned':
                this.targets.eyebrowPosition = 3;
                break;
            case 'thinking':
                this.targets.eyebrowPosition = 1;
                break;
            default:
                this.targets.eyebrowPosition = 0;
        }
    }
    
    detectEmotion(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('sad') || msg.includes('depressed') || msg.includes('anxious')) {
            this.setEmotion('empathetic');
            this.setState('listening');
        } else if (msg.includes('happy') || msg.includes('great') || msg.includes('wonderful')) {
            this.setEmotion('happy');
        } else if (msg.includes('worried') || msg.includes('scared') || msg.includes('afraid')) {
            this.setEmotion('concerned');
        } else if (msg.includes('think') || msg.includes('wonder') || msg.includes('question')) {
            this.setEmotion('thinking');
        } else if (msg.includes('help') || msg.includes('support') || msg.includes('guide')) {
            this.setEmotion('encouraging');
            this.setState('welcoming');
        }
    }
    
    nod() {
        this.setState('nodding');
    }
    
    gesture(type) {
        switch(type) {
            case 'welcome':
                this.setState('welcoming');
                break;
            case 'listen':
                this.setState('listening');
                break;
            case 'think':
                this.setState('thinking');
                break;
        }
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NUPIAvatar;
}
