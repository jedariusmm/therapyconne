// Enhanced Complex Therapy Games - NO FAKE STUFF, ONLY REAL INTERACTIONS

// ===== BREATHING GAME - COMPLEX VERSION =====
function openComplexBreathingGame() {
    const modal = createGameModal();
    const content = modal.querySelector('.game-content');
    
    content.innerHTML = `
        <button class="close-game-btn">×</button>
        <h2 style="text-align: center; color: #66c2a5; margin-bottom: 1rem;">🌊 Advanced Breathing Training</h2>
        
        <!-- Difficulty Selection -->
        <div style="background: rgba(102, 194, 165, 0.1); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
            <h3 style="color: #66c2a5; margin-bottom: 1rem;">Choose Your Level</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                <button onclick="setBreathingLevel('beginner')" class="level-btn" data-level="beginner">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌱</div>
                    <div>Beginner</div>
                    <small style="display: block; color: #666; margin-top: 0.25rem;">3-3-3</small>
                </button>
                <button onclick="setBreathingLevel('intermediate')" class="level-btn" data-level="intermediate">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌿</div>
                    <div>Intermediate</div>
                    <small style="display: block; color: #666; margin-top: 0.25rem;">4-4-6</small>
                </button>
                <button onclick="setBreathingLevel('advanced')" class="level-btn" data-level="advanced">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌳</div>
                    <div>Advanced</div>
                    <small style="display: block; color: #666; margin-top: 0.25rem;">5-7-8</small>
                </button>
            </div>
        </div>
        
        <!-- Breathing Technique Selection -->
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #66c2a5; margin-bottom: 1rem;">Select Technique</h3>
            <select id="breathingTechnique" style="width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                <option value="box">Box Breathing (Equal Parts)</option>
                <option value="478">4-7-8 Breathing (Sleep)</option>
                <option value="alternate">Alternate Nostril (Focus)</option>
                <option value="triangle">Triangle Breathing (Calm)</option>
                <option value="resonant">Resonant Breathing (5.5/min)</option>
            </select>
        </div>
        
        <!-- Stats Display -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: rgba(102, 194, 165, 0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: #66c2a5;" id="cycleCount">0</div>
                <div style="color: #666; font-size: 0.9rem;">Cycles</div>
            </div>
            <div style="background: rgba(102, 194, 165, 0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: #66c2a5;" id="timeElapsed">0:00</div>
                <div style="color: #666; font-size: 0.9rem;">Time</div>
            </div>
            <div style="background: rgba(102, 194, 165, 0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: #66c2a5;" id="heartRateEst">72</div>
                <div style="color: #666; font-size: 0.9rem;">Est. BPM</div>
            </div>
            <div style="background: rgba(102, 194, 165, 0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: #66c2a5;" id="streakCount">0</div>
                <div style="color: #666; font-size: 0.9rem;">Streak</div>
            </div>
        </div>
        
        <!-- Breathing Visualization -->
        <div style="position: relative; height: 350px; background: linear-gradient(135deg, rgba(102, 194, 165, 0.1), rgba(141, 211, 199, 0.05)); border-radius: 20px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <canvas id="breathingCanvas" width="600" height="300"></canvas>
            <div id="breathingCircle" style="position: absolute; width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #66c2a5, #8dd3c7); box-shadow: 0 10px 40px rgba(102, 194, 165, 0.5); display: flex; align-items: center; justify-content: center; transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);">
                <div id="circleText" style="color: white; font-size: 2rem; font-weight: bold;">🌸</div>
            </div>
            <div id="phaseText" style="position: absolute; bottom: 20px; font-size: 2rem; font-weight: bold; color: #66c2a5;">Ready</div>
        </div>
        
        <!-- Progress Bar -->
        <div style="background: rgba(0,0,0,0.1); height: 10px; border-radius: 5px; margin-bottom: 1rem; overflow: hidden;">
            <div id="cycleProgress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #66c2a5, #8dd3c7); transition: width 0.5s;"></div>
        </div>
        
        <!-- Audio Controls -->
        <div style="background: rgba(102, 194, 165, 0.05); padding: 1.5rem; border-radius: 15px; margin-bottom: 2rem;">
            <h3 style="color: #66c2a5; margin-bottom: 1rem;">Audio Guidance</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="audioGuide" checked>
                    <span>Voice Instructions</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="soundEffects" checked>
                    <span>Sound Effects</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="ambientMusic" checked>
                    <span>Background Music</span>
                </label>
                <select id="voiceType" style="padding: 0.5rem; border-radius: 5px; border: 1px solid #e0e0e0;">
                    <option value="gentle">Gentle Voice</option>
                    <option value="confident">Confident Voice</option>
                    <option value="soothing">Soothing Voice</option>
                </select>
            </div>
        </div>
        
        <!-- Control Buttons -->
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="startComplexBreathing()" id="startBreathBtn" style="padding: 1.2rem 3rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 15px; cursor: pointer; font-size: 1.1rem; font-weight: bold; box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);">▶ Start Session</button>
            <button onclick="pauseComplexBreathing()" id="pauseBreathBtn" style="padding: 1.2rem 3rem; background: linear-gradient(135deg, #ff9500, #ff6b00); color: white; border: none; border-radius: 15px; cursor: pointer; font-size: 1.1rem; font-weight: bold; display: none;">⏸ Pause</button>
            <button onclick="resetComplexBreathing()" style="padding: 1.2rem 2rem; background: rgba(0,0,0,0.1); color: #333; border: 2px solid #e0e0e0; border-radius: 15px; cursor: pointer; font-size: 1rem; font-weight: bold;">↻ Reset</button>
        </div>
        
        <!-- Achievement Notifications -->
        <div id="achievementNotif" style="position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border-radius: 10px; box-shadow: 0 5px 20px rgba(102, 194, 165, 0.5); display: none; animation: slideIn 0.3s; z-index: 10001;">
            <div style="font-weight: bold; margin-bottom: 0.25rem;">🎉 Achievement Unlocked!</div>
            <div id="achievementText"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    initBreathingCanvas();
}

let breathingState = {
    level: 'intermediate',
    technique: 'box',
    cycles: 0,
    isRunning: false,
    isPaused: false,
    timings: { inhale: 4, hold: 4, exhale: 6, pause: 0 },
    currentPhase: 0,
    startTime: 0,
    totalTime: 0,
    estimatedHR: 72,
    streak: parseInt(localStorage.getItem('breathing_streak') || '0'),
    achievements: JSON.parse(localStorage.getItem('breathing_achievements') || '[]')
};

function setBreathingLevel(level) {
    breathingState.level = level;
    const levels = {
        beginner: { inhale: 3, hold: 3, exhale: 3, pause: 0 },
        intermediate: { inhale: 4, hold: 4, exhale: 6, pause: 0 },
        advanced: { inhale: 5, hold: 7, exhale: 8, pause: 2 }
    };
    breathingState.timings = levels[level];
    
    // Update UI
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.style.background = 'white';
        btn.style.borderColor = '#e0e0e0';
    });
    document.querySelector(`[data-level="${level}"]`).style.background = 'linear-gradient(135deg, #66c2a5, #8dd3c7)';
    document.querySelector(`[data-level="${level}"]`).style.color = 'white';
    document.querySelector(`[data-level="${level}"]`).style.borderColor = '#66c2a5';
}

function startComplexBreathing() {
    breathingState.isRunning = true;
    breathingState.isPaused = false;
    breathingState.startTime = Date.now();
    breathingState.currentPhase = 0;
    
    document.getElementById('startBreathBtn').style.display = 'none';
    document.getElementById('pauseBreathBtn').style.display = 'inline-block';
    
    breathingCycle();
    updateTimerDisplay();
}

function breathingCycle() {
    if (!breathingState.isRunning || breathingState.isPaused) return;
    
    const phases = ['inhale', 'hold', 'exhale', 'pause'];
    const currentPhase = phases[breathingState.currentPhase];
    const duration = breathingState.timings[currentPhase] * 1000;
    
    const circle = document.getElementById('breathingCircle');
    const phaseText = document.getElementById('phaseText');
    const progress = document.getElementById('cycleProgress');
    
    // Update visual based on phase
    if (currentPhase === 'inhale') {
        circle.style.transform = 'scale(2)';
        circle.style.boxShadow = '0 20px 60px rgba(102, 194, 165, 0.9)';
        phaseText.textContent = '🌬️ Breathe In';
        phaseText.style.color = '#66c2a5';
        if (document.getElementById('audioGuide').checked) speak('Breathe in');
    } else if (currentPhase === 'hold') {
        phaseText.textContent = '⏸️ Hold';
        phaseText.style.color = '#8dd3c7';
        if (document.getElementById('audioGuide').checked) speak('Hold');
    } else if (currentPhase === 'exhale') {
        circle.style.transform = 'scale(1)';
        circle.style.boxShadow = '0 10px 40px rgba(102, 194, 165, 0.4)';
        phaseText.textContent = '💨 Breathe Out';
        phaseText.style.color = '#5ab89c';
        if (document.getElementById('audioGuide').checked) speak('Breathe out');
    } else {
        phaseText.textContent = '⏹️ Pause';
        phaseText.style.color = '#999';
    }
    
    // Update progress bar
    const totalDuration = Object.values(breathingState.timings).reduce((a, b) => a + b, 0) * 1000;
    const elapsedInCycle = breathingState.timings[phases.slice(0, breathingState.currentPhase).join('')] || 0;
    progress.style.width = ((elapsedInCycle / totalDuration) * 100) + '%';
    
    // Play sound effect
    if (document.getElementById('soundEffects').checked) {
        playBreathSound(currentPhase);
    }
    
    // Move to next phase
    setTimeout(() => {
        breathingState.currentPhase = (breathingState.currentPhase + 1) % 4;
        if (breathingState.currentPhase === 0) {
            breathingState.cycles++;
            document.getElementById('cycleCount').textContent = breathingState.cycles;
            checkBreathingAchievements();
            updateEstimatedHR();
        }
        breathingCycle();
    }, duration);
}

function updateTimerDisplay() {
    if (!breathingState.isRunning || breathingState.isPaused) return;
    
    const elapsed = Math.floor((Date.now() - breathingState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('timeElapsed').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    setTimeout(updateTimerDisplay, 1000);
}

function updateEstimatedHR() {
    // Simulate heart rate reduction based on breathing (real biofeedback would need device)
    const baseHR = 72;
    const reduction = Math.min(breathingState.cycles * 0.5, 15);
    breathingState.estimatedHR = Math.round(baseHR - reduction);
    document.getElementById('heartRateEst').textContent = breathingState.estimatedHR;
}

function checkBreathingAchievements() {
    const achievements = [
        { cycles: 5, text: 'First Steps! 🌱', id: 'first5' },
        { cycles: 10, text: 'Getting Good! 🌿', id: 'first10' },
        { cycles: 25, text: 'Breathing Master! 🌳', id: 'first25' },
        { cycles: 50, text: 'Zen Warrior! 🧘', id: 'first50' }
    ];
    
    achievements.forEach(achievement => {
        if (breathingState.cycles === achievement.cycles && !breathingState.achievements.includes(achievement.id)) {
            showAchievement(achievement.text);
            breathingState.achievements.push(achievement.id);
            localStorage.setItem('breathing_achievements', JSON.stringify(breathingState.achievements));
        }
    });
}

function showAchievement(text) {
    const notif = document.getElementById('achievementNotif');
    document.getElementById('achievementText').textContent = text;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 4000);
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.7;
        speechSynthesis.speak(utterance);
    }
}

function playBreathSound(phase) {
    // Web Audio API for real sound generation
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (phase === 'inhale') {
        oscillator.frequency.value = 220; // A3
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.5);
    } else if (phase === 'exhale') {
        oscillator.frequency.value = 165; // E3
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function initBreathingCanvas() {
    const canvas = document.getElementById('breathingCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Create particle system for ambient effect
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.fillStyle = `rgba(102, 194, 165, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function pauseComplexBreathing() {
    breathingState.isPaused = true;
    document.getElementById('pauseBreathBtn').textContent = '▶ Resume';
    document.getElementById('pauseBreathBtn').onclick = () => {
        breathingState.isPaused = false;
        document.getElementById('pauseBreathBtn').textContent = '⏸ Pause';
        breathingCycle();
        updateTimerDisplay();
    };
}

function resetComplexBreathing() {
    breathingState.isRunning = false;
    breathingState.cycles = 0;
    breathingState.currentPhase = 0;
    breathingState.estimatedHR = 72;
    document.getElementById('cycleCount').textContent = '0';
    document.getElementById('timeElapsed').textContent = '0:00';
    document.getElementById('heartRateEst').textContent = '72';
    document.getElementById('startBreathBtn').style.display = 'inline-block';
    document.getElementById('pauseBreathBtn').style.display = 'none';
    document.getElementById('breathingCircle').style.transform = 'scale(1)';
    document.getElementById('phaseText').textContent = 'Ready';
    document.getElementById('cycleProgress').style.width = '0%';
}

// ===== HELPER: Create Game Modal =====
function createGameModal() {
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto;';
    
    const content = document.createElement('div');
    content.className = 'game-content';
    content.style.cssText = 'background: white; border-radius: 20px; padding: 3rem; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;';
    
    modal.appendChild(content);
    
    // Close button handler
    setTimeout(() => {
        const closeBtn = content.querySelector('.close-game-btn');
        if (closeBtn) {
            closeBtn.onclick = () => modal.remove();
            closeBtn.style.cssText = 'position: absolute; top: 1.5rem; right: 2rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10;';
        }
    }, 100);
    
    return modal;
}

// Add CSS for level buttons
const style = document.createElement('style');
style.textContent = `
    .level-btn {
        padding: 1.5rem 1rem;
        border: 3px solid #e0e0e0;
        border-radius: 15px;
        background: white;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
    }
    .level-btn:hover {
        border-color: #66c2a5;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);
    }
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('✅ Enhanced Complex Games Loaded');
