// TherapyConnect Games Functions
// Complete game system with all interactive wellness games

window.openGame = function(gameType) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background: white; border-radius: 20px; padding: 3rem; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;';
    
    let gameHTML = '';
    
    if (gameType === 'breathing') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 2rem;">🌊 Deep Breathing Exercise</h2>
            <div style="text-align: center; margin-bottom: 1rem;">
                <span style="font-size: 1.2rem; color: #333;">Completed Cycles: <strong id="breathCount">0</strong></span>
            </div>
            <p style="text-align: center; margin-bottom: 2rem; color: #666;">Follow the circle. Breathe in for 4 seconds, hold for 4, breathe out for 6.</p>
            <div id="breathCircle" style="width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, #66c2a5, #8dd3c7); margin: 2rem auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: bold; box-shadow: 0 10px 40px rgba(102, 194, 165, 0.4); transition: all 4s ease-in-out;">🌸</div>
            <p id="breathText" style="text-align: center; font-size: 1.8rem; color: #66c2a5; font-weight: 600; min-height: 40px;">Ready to begin...</p>
            <button id="breathBtn" onclick="startBreathing()" style="display: block; margin: 2rem auto; padding: 1.2rem 3rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 15px; cursor: pointer; font-size: 1.1rem; font-weight: bold; box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);">Start Session</button>
        `;
    } else if (gameType === 'mood') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 1rem;">😊 Mood Check-In</h2>
            <p style="text-align: center; color: #666; margin-bottom: 2rem;">Track how you're feeling right now</p>
            <div id="moodHistory" style="text-align: center; margin-bottom: 2rem; min-height: 30px; font-size: 1.1rem; color: #66c2a5;"></div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                ${['😊 Happy', '😌 Calm', '😢 Sad', '😰 Anxious', '😠 Angry', '🤩 Excited', '😴 Tired', '🙏 Grateful'].map(m => 
                    `<button onclick="logMood('${m}')" style="padding: 2rem 1rem; border: 3px solid #e0e0e0; border-radius: 15px; background: linear-gradient(135deg, white, #f9f9f9); cursor: pointer; font-size: 1.2rem; transition: all 0.3s; font-weight: 600;" onmouseover="this.style.borderColor='#66c2a5'; this.style.transform='scale(1.05)'" onmouseout="this.style.borderColor='#e0e0e0'; this.style.transform='scale(1)'">${m}</button>`
                ).join('')}
            </div>
            <div id="moodInsight" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f0f9f7, #e8f5f1); border-radius: 15px; border: 2px solid #66c2a5; display: none;">
                <h3 style="color: #66c2a5; margin-bottom: 1rem;">💭 Insight</h3>
                <p id="insightText" style="color: #333; line-height: 1.6;"></p>
            </div>
        `;
    } else if (gameType === 'gratitude') {
        const savedGratitude = JSON.parse(localStorage.getItem('gratitudeLog') || '[]');
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 1rem;">🙏 Gratitude Journal</h2>
            <p style="text-align: center; color: #666; margin-bottom: 2rem;">Daily gratitude improves mental health by 25%</p>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
                <input id="gratInput" type="text" placeholder="I'm grateful for..." style="flex: 1; padding: 1.2rem; border: 3px solid #e0e0e0; border-radius: 12px; font-size: 1.05rem;" onkeypress="if(event.key==='Enter') addGratitudeItem()">
                <button onclick="addGratitudeItem()" style="padding: 1.2rem 2.5rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(102, 194, 165, 0.3);">Add ✨</button>
            </div>
            <div style="margin-bottom: 1rem; text-align: center; color: #66c2a5; font-size: 1.1rem;">
                <strong>Total Entries: ${savedGratitude.length}</strong>
            </div>
            <ul id="gratList" style="list-style: none; padding: 0; margin-top: 1rem; max-height: 300px; overflow-y: auto;">
                ${savedGratitude.slice(-10).reverse().map(item => 
                    `<li style="background: linear-gradient(135deg, #f0f9f7, #e8f5f1); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid #66c2a5; font-size: 1.1rem; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"><strong style="color: #66c2a5;">✨</strong> ${item.text}</li>`
                ).join('')}
            </ul>
        `;
    } else if (gameType === 'memory') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 1rem;">🧩 Memory Match Challenge</h2>
            <p style="text-align: center; margin-bottom: 1rem; color: #666;">Find matching pairs - improves cognitive function!</p>
            <div style="text-align: center; margin-bottom: 1.5rem; font-size: 1.1rem; color: #66c2a5;">
                <strong id="moveCount">Moves: 0</strong> | <strong id="matchCount">Matches: 0/8</strong>
            </div>
            <div id="memoryGrid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; max-width: 450px; margin: 0 auto;"></div>
            <button onclick="startMemoryGame()" style="display: block; margin: 2rem auto; padding: 1.2rem 3rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; font-size: 1.1rem; box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);">New Game 🎮</button>
        `;
    } else if (gameType === 'affirmations') {
        const affirmations = [
            {text: 'You are enough', tip: 'Your worth is inherent, not earned.'},
            {text: 'You are loved', tip: 'Love surrounds you, even in difficult times.'},
            {text: 'You are capable', tip: 'You have overcome challenges before.'},
            {text: 'You are strong', tip: 'Strength comes from within.'},
            {text: 'You are worthy', tip: 'You deserve good things.'},
            {text: 'You deserve happiness', tip: 'Joy is your birthright.'},
            {text: 'You can do this', tip: 'One step at a time leads to success.'},
            {text: 'You matter', tip: 'Your presence makes a difference.'},
            {text: 'You are growing', tip: 'Every experience helps you evolve.'},
            {text: 'You are resilient', tip: 'You bend but never break.'}
        ];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 2rem;">✨ Daily Affirmation</h2>
            <div style="background: linear-gradient(135deg, #66c2a5, #8dd3c7); padding: 4rem 2rem; border-radius: 20px; text-align: center; color: white; font-size: 2.2rem; font-weight: bold; margin-bottom: 1.5rem; box-shadow: 0 10px 40px rgba(102, 194, 165, 0.4);">"${randomAffirmation.text}"</div>
            <div style="background: #f0f9f7; padding: 1.5rem; border-radius: 15px; border-left: 4px solid #66c2a5; margin-bottom: 2rem;">
                <p style="color: #333; font-size: 1.1rem; line-height: 1.6;"><strong style="color: #66c2a5;">💡 Reminder:</strong> ${randomAffirmation.tip}</p>
            </div>
            <p style="text-align: center; color: #666; font-size: 1.1rem;">Repeat out loud 3 times for maximum effect! 💜</p>
            <button onclick="openGame('affirmations')" style="display: block; margin: 2rem auto; padding: 1.2rem 3rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; font-size: 1.1rem; box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);">Get Another ✨</button>
        `;
    } else if (gameType === 'worry') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 1rem;">📦 Worry Release Box</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: #666;">Studies show that writing worries down reduces anxiety by 30%</p>
            <textarea id="worryInput" placeholder="What's on your mind? Write it all out..." style="width: 100%; height: 180px; padding: 1.5rem; border: 3px solid #e0e0e0; border-radius: 15px; margin-bottom: 1rem; resize: none; font-size: 1.05rem; font-family: inherit;"></textarea>
            <button onclick="releaseWorry()" style="width: 100%; padding: 1.5rem; background: linear-gradient(135deg, #66c2a5, #8dd3c7); color: white; border: none; border-radius: 15px; cursor: pointer; font-weight: bold; font-size: 1.2rem; box-shadow: 0 5px 15px rgba(102, 194, 165, 0.3);">Release Worry 🎈</button>
            <div id="worryMessage" style="text-align: center; margin-top: 2rem; padding: 1.5rem; border-radius: 12px; display: none;"></div>
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f0f9f7; border-radius: 12px; border-left: 4px solid #66c2a5;">
                <p style="color: #333; line-height: 1.6;"><strong style="color: #66c2a5;">💡 Tip:</strong> After releasing, try 3 deep breaths or a short walk to reset your mind.</p>
            </div>
        `;
    } else if (gameType === 'quiz') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 2rem;">🧠 Mindfulness Quiz</h2>
            <div id="quizContent"></div>
            <button onclick="startQuiz()" style="display: block; margin: 2rem auto; padding: 1rem 2rem; background: #66c2a5; color: white; border: none; border-radius: 10px; cursor: pointer;">Start Quiz</button>
        `;
    } else if (gameType === 'emotion') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 2rem;">🎨 Emotion Wheel</h2>
            <p style="text-align: center; margin-bottom: 2rem;">Click on an emotion to explore it deeper</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                ${['😊 Joy', '😢 Sadness', '😠 Anger', '😨 Fear', '🤢 Disgust', '😲 Surprise', '❤️ Love', '😌 Peace', '😰 Anxiety'].map(e => 
                    `<button onclick="exploreEmotion('${e}')" style="padding: 1.5rem 1rem; border: 2px solid #e0e0e0; border-radius: 15px; background: white; cursor: pointer; font-size: 1.1rem;">${e}</button>`
                ).join('')}
            </div>
        `;
    } else if (gameType === 'puzzle') {
        gameHTML = `
            <button onclick="this.closest('div').parentElement.remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: #66c2a5; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="text-align: center; color: #66c2a5; margin-bottom: 2rem;">🎯 Zen Puzzle</h2>
            <p style="text-align: center; margin-bottom: 2rem;">Click symbols to create peaceful patterns</p>
            <div id="zenCanvas" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; width: 100%; max-width: 400px; margin: 0 auto; padding: 0 1rem;"></div>
            <button onclick="startZenPuzzle()" style="display: block; margin: 2rem auto; padding: 1rem 2rem; background: #66c2a5; color: white; border: none; border-radius: 10px; cursor: pointer;">New Pattern</button>
        `;
    }
    
    content.innerHTML = gameHTML;
    modal.appendChild(content);
    document.body.appendChild(modal);
};

console.log('✅ openGame function ready');

// Helper Functions for Game Interactions

function startBreathing() {
    const circle = document.getElementById('breathCircle');
    const text = document.getElementById('breathText');
    const countEl = document.getElementById('breathCount');
    const btn = document.getElementById('breathBtn');
    let count = 0;
    let phase = 0; // 0: inhale, 1: hold, 2: exhale
    
    btn.style.display = 'none';
    
    function breathCycle() {
        if (phase === 0) {
            circle.style.transform = 'scale(1.8)';
            circle.style.boxShadow = '0 20px 60px rgba(102, 194, 165, 0.8)';
            text.textContent = '🌬️ Breathe In (4s)';
            text.style.color = '#66c2a5';
            setTimeout(() => { phase = 1; breathCycle(); }, 4000);
        } else if (phase === 1) {
            text.textContent = '⏸️ Hold (4s)';
            text.style.color = '#8dd3c7';
            setTimeout(() => { phase = 2; breathCycle(); }, 4000);
        } else {
            circle.style.transform = 'scale(1)';
            circle.style.boxShadow = '0 10px 40px rgba(102, 194, 165, 0.4)';
            text.textContent = '💨 Breathe Out (6s)';
            text.style.color = '#5ab89c';
            count++;
            countEl.textContent = count;
            setTimeout(() => { phase = 0; breathCycle(); }, 6000);
        }
    }
    
    breathCycle();
}

function logMood(mood) {
    const insights = {
        '😊 Happy': 'Wonderful! Happiness boosts your immune system and helps you live longer. Savor this feeling!',
        '😌 Calm': 'Perfect! Calmness reduces stress hormones and improves decision-making. You\'re in a great state.',
        '😢 Sad': 'It\'s okay to feel sad. This emotion helps you process loss and change. Be gentle with yourself.',
        '😰 Anxious': 'Anxiety is your body\'s alarm system. Try deep breathing or talk to someone you trust.',
        '😠 Angry': 'Anger shows you care about something. Channel it constructively - exercise or journaling can help.',
        '🤩 Excited': 'Excitement fuels creativity and motivation! Use this energy to pursue what matters to you.',
        '😴 Tired': 'Rest is productive. Your body and mind need recovery time. Consider a short break or nap.',
        '🙏 Grateful': 'Gratitude rewires your brain for positivity! Studies show it improves mental health significantly.'
    };
    
    const historyEl = document.getElementById('moodHistory');
    const insightEl = document.getElementById('moodInsight');
    const insightText = document.getElementById('insightText');
    
    const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    historyEl.innerHTML = `<strong>Logged at ${now}:</strong> ${mood}`;
    
    insightText.textContent = insights[mood];
    insightEl.style.display = 'block';
    
    // Save to localStorage
    const moodLog = JSON.parse(localStorage.getItem('moodLog') || '[]');
    moodLog.push({mood, time: now, date: new Date().toLocaleDateString()});
    localStorage.setItem('moodLog', JSON.stringify(moodLog.slice(-20))); // Keep last 20
}

function addGratitudeItem() {
    const input = document.getElementById('gratInput');
    const list = document.getElementById('gratList');
    if (input.value.trim()) {
        const li = document.createElement('li');
        li.style.cssText = 'background: linear-gradient(135deg, #f0f9f7, #e8f5f1); padding: 1.2rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid #66c2a5; font-size: 1.1rem; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.08);';
        li.innerHTML = `<strong style="color: #66c2a5;">✨</strong> ${input.value}`;
        list.appendChild(li);
        
        // Save to localStorage
        const gratLog = JSON.parse(localStorage.getItem('gratitudeLog') || '[]');
        gratLog.push({text: input.value, date: new Date().toLocaleDateString()});
        localStorage.setItem('gratitudeLog', JSON.stringify(gratLog));
        
        input.value = '';
    }
}

function startMemoryGame() {
    const symbols = ['🌸', '🌺', '🌻', '🌼', '🍀', '🌿', '🦋', '🐝'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    let flipped = [];
    let matched = 0;
    let moves = 0;
    const startTime = Date.now();
    
    cards.forEach((symbol, i) => {
        const card = document.createElement('div');
        card.style.cssText = 'aspect-ratio: 1; background: linear-gradient(135deg, #66c2a5, #8dd3c7); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; cursor: pointer; color: transparent; border: 3px solid transparent; box-shadow: 0 4px 12px rgba(102, 194, 165, 0.3); transition: all 0.3s;';
        card.dataset.symbol = symbol;
        card.dataset.index = i;
        card.onclick = function() {
            if (flipped.length < 2 && this.style.color === 'transparent') {
                this.style.color = 'white';
                this.textContent = symbol;
                this.style.borderColor = '#fff';
                this.style.transform = 'scale(1.1)';
                flipped.push(this);
                
                if (flipped.length === 2) {
                    moves++;
                    document.getElementById('moveCount').textContent = 'Moves: ' + moves;
                    setTimeout(() => {
                        if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
                            flipped.forEach(c => { 
                                c.style.background = 'linear-gradient(135deg, #4db89a, #66c2a5)';
                                c.style.borderColor = '#4db89a';
                            });
                            matched += 2;
                            document.getElementById('matchCount').textContent = 'Matches: ' + (matched/2) + '/8';
                            if (matched === cards.length) {
                                const time = Math.floor((Date.now() - startTime) / 1000);
                                alert(`🎉 Excellent! You won in ${moves} moves and ${time} seconds! Memory training improves cognitive function.`);
                            }
                        } else {
                            flipped.forEach(c => { 
                                c.style.color = 'transparent'; 
                                c.textContent = ''; 
                                c.style.borderColor = 'transparent';
                                c.style.transform = 'scale(1)';
                            });
                        }
                        flipped = [];
                    }, 800);
                }
            }
        };
        grid.appendChild(card);
    });
}

function releaseWorry() {
    const input = document.getElementById('worryInput');
    const message = document.getElementById('worryMessage');
    if (input.value.trim()) {
        // Animate the worry floating away
        input.style.transition = 'all 1.5s ease-out';
        input.style.opacity = '0';
        input.style.transform = 'translateY(-100px) scale(0.8)';
        input.style.filter = 'blur(4px)';
        
        setTimeout(() => {
            input.value = '';
            input.style.opacity = '1';
            input.style.transform = 'translateY(0) scale(1)';
            input.style.filter = 'blur(0)';
            
            // Show success message
            message.style.display = 'block';
            message.style.background = 'linear-gradient(135deg, #f0f9f7, #e8f5f1)';
            message.style.color = '#66c2a5';
            message.style.border = '2px solid #66c2a5';
            message.innerHTML = '<strong style="font-size: 1.3rem;">🎈 Worry Released!</strong><p style="color: #333; margin-top: 0.5rem;">You\'ve let go. Now take 3 deep breaths and focus on what you can control.</p>';
            
            // Save release count
            const releaseCount = parseInt(localStorage.getItem('worryReleaseCount') || '0') + 1;
            localStorage.setItem('worryReleaseCount', releaseCount);
        }, 1500);
    } else {
        message.style.display = 'block';
        message.style.background = '#fff3cd';
        message.style.color = '#856404';
        message.style.border = '2px solid #ffc107';
        message.textContent = 'Please write down your worry first.';
    }
}

function startQuiz() {
    const questions = [
        {q: 'What is mindfulness?', a: ['Being aware of the present moment', 'Thinking about the past', 'Planning the future'], correct: 0},
        {q: 'How long should you meditate daily?', a: ['At least 5-10 minutes', '2 hours', 'All day'], correct: 0},
        {q: 'Deep breathing helps with:', a: ['Anxiety and stress', 'Nothing', 'Making you dizzy'], correct: 0}
    ];
    
    let currentQ = 0;
    let score = 0;
    const content = document.getElementById('quizContent');
    
    function showQuestion() {
        if (currentQ < questions.length) {
            const q = questions[currentQ];
            content.innerHTML = `
                <h3 style="margin-bottom: 1rem;">Question ${currentQ + 1}: ${q.q}</h3>
                ${q.a.map((ans, i) => `<button onclick="checkAnswer(${i})" style="display: block; width: 100%; padding: 1rem; margin-bottom: 0.5rem; border: 2px solid #e0e0e0; border-radius: 10px; background: white; cursor: pointer;">${ans}</button>`).join('')}
            `;
        } else {
            content.innerHTML = `<h3 style="text-align: center; color: #66c2a5;">You scored ${score}/${questions.length}! 🎉</h3>`;
        }
    }
    
    window.checkAnswer = function(ans) {
        if (ans === questions[currentQ].correct) score++;
        currentQ++;
        showQuestion();
    };
    
    showQuestion();
}

function exploreEmotion(emotion) {
    const messages = {
        '😊 Joy': 'Joy is a beautiful feeling! Savor this moment.',
        '😢 Sadness': 'It\'s okay to feel sad. This too shall pass.',
        '😠 Anger': 'Anger is valid. Take deep breaths and find healthy outlets.',
        '😨 Fear': 'Fear protects us. Acknowledge it, then choose courage.',
        '🤢 Disgust': 'This feeling helps us set boundaries.',
        '😲 Surprise': 'Surprise keeps life interesting!',
        '❤️ Love': 'Love is the most powerful emotion. Cherish it.',
        '😌 Peace': 'Peace is found within. You\'re exactly where you need to be.',
        '😰 Anxiety': 'Anxiety shows you care. Ground yourself in the present moment.'
    };
    alert(messages[emotion] || 'Exploring this emotion...');
}

function startZenPuzzle() {
    const symbols = ['🌸', '🌺', '🌻', '🍀', '☯️', '🕉️', '✨', '💫'];
    const canvas = document.getElementById('zenCanvas');
    canvas.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.style.cssText = 'aspect-ratio: 1; background: white; border: 2px solid #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; touch-action: manipulation;';
        
        const handleClick = function() {
            this.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            this.style.background = '#66c2a5';
            this.style.borderColor = '#66c2a5';
        };
        
        // Support both mouse and touch events
        cell.onclick = handleClick;
        cell.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleClick.call(this);
        }, {passive: false});
        
        canvas.appendChild(cell);
    }
}

// Assign all functions to window for global access
window.startBreathing = startBreathing;
window.logMood = logMood;
window.addGratitudeItem = addGratitudeItem;
window.startMemoryGame = startMemoryGame;
window.releaseWorry = releaseWorry;
window.startQuiz = startQuiz;
window.exploreEmotion = exploreEmotion;
window.startZenPuzzle = startZenPuzzle;

console.log('✅ All game functions loaded successfully');
