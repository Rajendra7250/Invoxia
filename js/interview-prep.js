/* ============================================
   INVOXIA - AI Interview Prep Suite Logic
   Vanilla JS equivalent of the React component
   ============================================ */

/* ---- State ---- */
const prepState = {
  step: 1,
  user: { name: '', role: 'Frontend Developer', exp: 'Fresher' }
};

const loaderMessages = [
  'Initializing Neural Engine...',
  'Analyzing Candidate Profile...',
  'Preparing Interview Environment...'
];

const tips = {
  'Frontend Developer': [
    '🎯 Brush up on JavaScript closures, event delegation, and the virtual DOM — these come up in almost every frontend interview.',
    '💡 Be ready to explain the CSS box model, specificity rules, and how Flexbox differs from Grid.',
    '⚡ Practice building small UI components from scratch without a framework to demonstrate fundamentals.',
    '🔍 Know the difference between SSR and CSR and when to use each in React/Next.js.',
    '📦 Study common design patterns like Observer, Factory, and Singleton — they signal seniority.'
  ],
  'Backend Developer': [
    '🗄️ Be solid on database indexing, ACID properties, and the difference between SQL and NoSQL.',
    '🔐 Understand OAuth 2.0, JWT, and session-based authentication — security is always asked.',
    '⚙️ Know RESTful API design principles and when GraphQL is a better choice.',
    '📈 Study system design basics: load balancers, caching strategies, and horizontal vs vertical scaling.',
    '🚀 Practice explaining the lifecycle of an HTTP request end-to-end.'
  ],
  'Full Stack Developer': [
    '🔄 Understand how data flows from database → API → frontend and be ready to whiteboard it.',
    '🌐 Know CORS, same-origin policy, and how to handle authentication across the stack.',
    '📦 Package management, bundling (Webpack/Vite), and environment variables are common topics.',
    '🧪 Be ready to discuss testing strategies: unit, integration, and e2e.',
    '🏗️ Practise a mini full-stack project (CRUD app) — interviewers love seeing the full picture.'
  ],
  'Data Analyst': [
    '📊 Practice complex SQL queries: window functions, CTEs, and joins are heavily tested.',
    '📉 Be able to explain how you would approach a data quality issue from scratch.',
    '📈 Know your chart types — and more importantly, when NOT to use a pie chart.',
    '🐍 Pandas and NumPy operations should be second nature for Python-based roles.',
    '🎯 Prepare a story about a data insight that drove a business decision — storytelling matters.'
  ],
  'Data Scientist': [
    '🤖 Understand bias-variance tradeoff and be ready to give concrete examples.',
    '📐 Know when to use precision vs recall, and what F1-score actually represents.',
    '🧠 Study the maths behind gradient descent — interviewers probe deeper than scikit-learn calls.',
    '📊 Feature engineering stories impress more than model accuracy scores alone.',
    '🔬 Be ready to explain your model\'s behaviour to a non-technical stakeholder.'
  ],
  'UI/UX Designer': [
    '🎨 Be ready to walk through your entire design process for a past project end-to-end.',
    '♿ Accessibility (WCAG 2.1) knowledge signals professional maturity.',
    '📐 Know Gestalt principles and be able to apply them to real UI critique.',
    '💬 Practice explaining your design decisions in terms of user needs, not aesthetics.',
    '🔄 Prepare a case where user testing changed your design direction significantly.'
  ],
  'Product Manager': [
    '📋 Master the CIRCLES framework for product design questions.',
    '📊 Be ready to define, prioritise, and defend a product roadmap from scratch.',
    '💡 Practice estimating market size and user metrics off the top of your head.',
    '🔄 Know the difference between OKRs and KPIs and how you\'d set them for a new feature.',
    '🎯 Prepare a story about a time you made a hard prioritisation call with limited data.'
  ],
  'DevOps Engineer': [
    '🐳 Docker and Kubernetes fundamentals are table stakes — know pods, services, and deployments.',
    '🔄 Understand CI/CD pipelines deeply: branching strategies, environments, and rollback plans.',
    '🔐 Infrastructure as Code (Terraform/Ansible) experience is highly valued.',
    '📈 Know how to set up observability: metrics, logs, and traces (the golden triangle).',
    '⚡ Study Linux fundamentals: process management, file permissions, and networking tools.'
  ]
};

/* ---- Step Navigation ---- */
function goStep(n) {
  const current = document.getElementById(`step${prepState.step}`);
  const next    = document.getElementById(`step${n}`);
  if (!current || !next) return;

  current.classList.add('fade-out');
  setTimeout(() => {
    current.classList.remove('active', 'fade-out');
    current.style.display = '';

    // Keep display:flex for centering  
    next.style.display = 'flex';
    next.classList.add('active', 'fade-in');
    setTimeout(() => next.classList.remove('fade-in'), 400);
    prepState.step = n;
  }, 280);
}

/* ---- Step 2: Continue ---- */
function handleContinue() {
  const nameEl = document.getElementById('userName');
  const roleEl = document.getElementById('userRole');
  const expEl  = document.getElementById('userExp');

  const name = nameEl.value.trim();
  if (!name) {
    if (window.InvoxiaUtils) {
      window.InvoxiaUtils.showToast('Please enter your name to continue.', 'error');
    }
    nameEl.focus();
    return;
  }

  prepState.user.name = name;
  prepState.user.role = roleEl.value;
  prepState.user.exp  = expEl.value;

  goStep(3);
  runLoader();
}

/* ---- Step 3: Loader ---- */
function runLoader() {
  const msgEl = document.getElementById('loaderMsg');
  let idx = 0;

  const interval = setInterval(() => {
    idx++;
    if (idx < loaderMessages.length && msgEl) {
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.textContent = loaderMessages[idx];
        msgEl.style.opacity = '1';
      }, 200);
    }
  }, 600);

  setTimeout(() => {
    clearInterval(interval);
    populateDashboard();
    goStep(4);
  }, 3000);
}

/* ---- Step 4: Dashboard ---- */
function populateDashboard() {
  const { name, role, exp } = prepState.user;
  
  // Welcome
  const dashName = document.getElementById('dashName');
  const dashMeta = document.getElementById('dashMeta');
  if (dashName) dashName.textContent = name || 'User';
  if (dashMeta) dashMeta.textContent = `Role: ${role}  |  Experience: ${exp}`;

  // Stats
  const qMap = { Fresher: 42, '1-2 Years': 58, '3+ Years': 75 };
  const dMap = { Fresher: 'Entry', '1-2 Years': 'Mid', '3+ Years': 'Senior' };
  animateCounter('statQuestions', qMap[exp] || 50);
  const statDiff = document.getElementById('statDiff');
  if (statDiff) statDiff.textContent = dMap[exp] || 'Mid';

  // Tips
  const tipRoleEl = document.getElementById('tipRole');
  if (tipRoleEl) tipRoleEl.textContent = role;
  showRandomTip();
}

function showRandomTip() {
  const role = prepState.user.role;
  const tipList = tips[role] || tips['Frontend Developer'];
  const tip = tipList[Math.floor(Math.random() * tipList.length)];
  const tipEl = document.getElementById('tipText');
  if (tipEl) {
    tipEl.style.opacity = '0';
    setTimeout(() => {
      tipEl.textContent = tip;
      tipEl.style.opacity = '1';
      tipEl.style.transition = 'opacity 0.4s ease';
    }, 150);
  }
}

window.refreshTip = showRandomTip;

/* ---- Counter animation ---- */
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 40);
}

/* ---- Restart ---- */
window.restart = function () {
  prepState.user = { name: '', role: 'Frontend Developer', exp: 'Fresher' };
  document.getElementById('userName').value = '';
  document.getElementById('userRole').selectedIndex = 0;
  document.getElementById('userExp').selectedIndex = 0;
  goStep(1);
};

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('step1')) return;

  // Pre-select defaults so state always has values
  const roleEl = document.getElementById('userRole');
  const expEl  = document.getElementById('userExp');
  if (roleEl) roleEl.addEventListener('change', e => prepState.user.role = e.target.value);
  if (expEl)  expEl.addEventListener('change', e => prepState.user.exp  = e.target.value);
});
