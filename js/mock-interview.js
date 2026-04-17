/* ============================================
   INVOXIA - Mock Interview Logic
   Module Owner: Member 3
   Branch: feature/mock-interview
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Only run on mock interview page
  if (!document.querySelector('.interview-page')) return;

  // State
  let selectedRole = null;
  let selectedDifficulty = 'intermediate';
  let timerInterval = null;
  let timeElapsed = 0;
  let currentQuestionIndex = 0;
  let chatHistory = [];

  // ---- Interview Questions Bank ----
  const questionBank = {
    frontend: {
      easy: [
        'What is the difference between HTML and HTML5?',
        'Explain the CSS Box Model.',
        'What are semantic HTML elements? Give examples.',
        'What is the difference between `let`, `const`, and `var`?',
        'How does the browser render a web page?'
      ],
      intermediate: [
        'Explain closures in JavaScript with an example.',
        'What is the Virtual DOM and how does React use it?',
        'Describe the event delegation pattern.',
        'How would you optimize web page performance?',
        'Explain the difference between CSS Grid and Flexbox.'
      ],
      hard: [
        'How would you implement a custom React hooks system from scratch?',
        'Explain the internals of JavaScript\'s event loop, including microtasks and macrotasks.',
        'Design a component library with theming support. What architecture would you use?',
        'How would you implement SSR with streaming in a React application?',
        'Explain how the browser\'s rendering pipeline works and how to optimize for 60fps.'
      ]
    },
    backend: {
      easy: [
        'What is REST API? Explain its principles.',
        'What is the difference between SQL and NoSQL databases?',
        'Explain HTTP status codes and their categories.',
        'What is middleware in Express.js/Django?',
        'How does session-based authentication work?'
      ],
      intermediate: [
        'Explain database indexing and when to use it.',
        'How would you design a rate limiter?',
        'Describe ACID properties with examples.',
        'What is the difference between horizontal and vertical scaling?',
        'How do you handle authentication with JWT? Explain the flow.'
      ],
      hard: [
        'Design a distributed caching system. Consider consistency and eviction policies.',
        'How would you implement a message queue system from scratch?',
        'Explain the CAP theorem with real-world trade-off examples.',
        'How would you design a real-time notification system for millions of users?',
        'Describe how you\'d implement a database connection pool with failover.'
      ]
    },
    fullstack: {
      easy: [
        'What is the difference between client-side and server-side rendering?',
        'Explain the MVC architecture pattern.',
        'How does CORS work and why is it needed?',
        'What is the purpose of environment variables?',
        'Explain the difference between cookies and localStorage.'
      ],
      intermediate: [
        'How would you implement real-time features in a web application?',
        'Describe your approach to managing state in a full-stack application.',
        'How do you handle file uploads efficiently?',
        'Explain microservices vs monolithic architecture trade-offs.',
        'How would you implement a search feature with autocomplete?'
      ],
      hard: [
        'Design a collaborative document editing system like Google Docs.',
        'How would you architect a multi-tenant SaaS platform?',
        'Explain how you\'d implement end-to-end encryption in a chat application.',
        'Design a CI/CD pipeline for a microservices architecture.',
        'How would you handle eventual consistency in a distributed e-commerce system?'
      ]
    }
  };

  // ---- AI Response Templates ----
  const feedbackTemplates = {
    good: [
      'Great answer! You covered the key points well. Let me add a few more details...',
      'Excellent explanation! Your understanding is solid. One thing to also consider...',
      'Well structured response! You demonstrated strong knowledge. Additionally...'
    ],
    average: [
      'Good attempt! You\'re on the right track. Let me help you refine your answer...',
      'You covered some important points. Here\'s what you could add to make your answer stronger...',
      'Decent foundation! To give a more comprehensive answer, consider including...'
    ],
    followUp: [
      'That\'s interesting. Can you elaborate on how you would handle edge cases?',
      'Good point. What about scalability considerations?',
      'Nice. How would you approach testing this solution?'
    ]
  };

  // ---- Role Selection ----
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.dataset.role;
    });
  });

  // ---- Difficulty Selection ----
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.difficulty;
    });
  });

  // ---- Start Interview ----
  const startBtn = document.getElementById('startInterview');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!selectedRole) {
        window.InvoxiaUtils?.showToast('Please select a role first!', 'error');
        return;
      }
      startInterview();
    });
  }

  function startInterview() {
    const setupEl = document.getElementById('interviewSetup');
    const sessionEl = document.getElementById('interviewSession');
    if (setupEl) setupEl.style.display = 'none';
    if (sessionEl) sessionEl.classList.add('active');

    // Reset state
    timeElapsed = 0;
    currentQuestionIndex = 0;
    chatHistory = [];

    // Start timer
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeElapsed++;
      updateTimerDisplay();
    }, 1000);

    // Ask first question
    setTimeout(() => {
      askQuestion();
    }, 500);
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('interviewTimer');
    if (timerEl) timerEl.textContent = window.InvoxiaUtils?.formatTime(timeElapsed) || formatTime(timeElapsed);
  }

  function formatTime(s) {
    return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  }

  // ---- Ask Question ----
  function askQuestion() {
    const questions = questionBank[selectedRole]?.[selectedDifficulty] || questionBank.fullstack.intermediate;
    if (currentQuestionIndex >= questions.length) {
      endInterview();
      return;
    }

    const question = questions[currentQuestionIndex];
    addMessage('ai', `**Question ${currentQuestionIndex + 1}/${questions.length}:**\n\n${question}`);
    updateProgress();
  }

  function updateProgress() {
    const questions = questionBank[selectedRole]?.[selectedDifficulty] || [];
    const progressFill = document.querySelector('.progress-bar-mini .fill');
    const progressText = document.getElementById('progressText');
    if (progressFill) {
      progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    }
    if (progressText) {
      progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    }
  }

  // ---- Send Answer ----
  const sendBtn = document.getElementById('sendAnswer');
  const inputEl = document.getElementById('userAnswer');

  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => sendAnswer());
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAnswer();
      }
    });
  }

  function sendAnswer() {
    const text = inputEl?.value.trim();
    if (!text) return;

    addMessage('user', text);
    inputEl.value = '';

    // Simulate AI feedback
    setTimeout(() => {
      const templates = text.length > 100 ? feedbackTemplates.good : feedbackTemplates.average;
      const feedback = templates[Math.floor(Math.random() * templates.length)];
      addMessage('ai', feedback);

      // Move to next question after a brief delay
      currentQuestionIndex++;
      setTimeout(() => {
        askQuestion();
      }, 1500);
    }, 1000);
  }

  // ---- Chat Messages ----
  function addMessage(type, text) {
    const container = document.getElementById('chatContainer');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;

    const formattedText = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    msg.innerHTML = `
      <div class="chat-avatar">${type === 'ai' ? '🤖' : '👤'}</div>
      <div class="chat-bubble">${formattedText}</div>
    `;

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    chatHistory.push({ type, text });
  }

  // ---- End Interview ----
  function endInterview() {
    clearInterval(timerInterval);

    addMessage('ai', '🎉 **Interview Complete!** Great job! Let me analyze your performance...');

    setTimeout(() => {
      showFeedback();
    }, 1500);
  }

  window.endInterviewManual = () => {
    clearInterval(timerInterval);
    showFeedback();
  };

  function showFeedback() {
    const feedbackPanel = document.getElementById('feedbackPanel');
    if (!feedbackPanel) return;
    feedbackPanel.classList.add('active');

    // Calculate mock scores
    const userAnswers = chatHistory.filter(m => m.type === 'user');
    const avgLength = userAnswers.reduce((sum, a) => sum + a.text.length, 0) / (userAnswers.length || 1);

    const scores = {
      communication: Math.min(95, Math.floor(60 + avgLength / 10)),
      technical: Math.min(92, Math.floor(55 + Math.random() * 30)),
      problemSolving: Math.min(90, Math.floor(50 + Math.random() * 35)),
      confidence: Math.min(88, Math.floor(60 + Math.random() * 25))
    };

    const overall = Math.floor((scores.communication + scores.technical + scores.problemSolving + scores.confidence) / 4);

    // Update UI
    const overallEl = document.getElementById('overallScore');
    if (overallEl) overallEl.textContent = overall + '%';

    // Animate metrics
    Object.entries(scores).forEach(([key, value]) => {
      const fillEl = document.querySelector(`[data-metric="${key}"] .fill`);
      const valueEl = document.querySelector(`[data-metric="${key}"] .metric-value`);
      if (fillEl) {
        setTimeout(() => {
          fillEl.style.width = `${value}%`;
        }, 300);
      }
      if (valueEl) valueEl.textContent = value + '%';
    });

    // Scroll to feedback
    feedbackPanel.scrollIntoView({ behavior: 'smooth' });
  }

  // ---- Restart ----
  window.restartInterview = () => {
    const setupEl = document.getElementById('interviewSetup');
    const sessionEl = document.getElementById('interviewSession');
    const feedbackPanel = document.getElementById('feedbackPanel');
    const chatContainer = document.getElementById('chatContainer');

    if (setupEl) setupEl.style.display = 'block';
    if (sessionEl) sessionEl.classList.remove('active');
    if (feedbackPanel) feedbackPanel.classList.remove('active');
    if (chatContainer) chatContainer.innerHTML = '';

    clearInterval(timerInterval);
    timeElapsed = 0;
    currentQuestionIndex = 0;
    chatHistory = [];
  };
});
