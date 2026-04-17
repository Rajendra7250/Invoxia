/* ============================================
   INVOXIA - Concept Revision Logic
   Module Owner: Member 2
   Branch: feature/concept-revision
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Only run on revision page
  if (!document.querySelector('.revision-page')) return;

  // ---- Sample Topics Data ----
  const topicsData = {
    dsa: {
      name: 'Data Structures & Algorithms',
      topics: [
        {
          id: 'arrays',
          name: 'Arrays & Strings',
          difficulty: 'Easy',
          progress: 80,
          flashcards: [
            { question: 'What is the time complexity of accessing an element in an array by index?', answer: 'O(1) — Arrays provide constant-time access because elements are stored in contiguous memory locations, and the address can be calculated directly from the index.' },
            { question: 'What is the difference between an Array and a Linked List?', answer: 'Arrays have O(1) random access but O(n) insertion/deletion. Linked Lists have O(n) access but O(1) insertion/deletion at known positions. Arrays use contiguous memory, while Linked Lists use scattered nodes connected by pointers.' },
            { question: 'Explain the Two Pointer technique.', answer: 'Two Pointer is a technique where two pointers iterate through the data structure (usually from opposite ends). It reduces time complexity from O(n²) to O(n) for problems like finding pairs with a given sum in a sorted array.' }
          ],
          notes: `## Arrays Fundamentals\n\nAn array is a data structure consisting of a collection of elements, each identified by an index.\n\n### Key Operations\n- **Access**: O(1)\n- **Search**: O(n) for unsorted, O(log n) for sorted\n- **Insertion**: O(n)\n- **Deletion**: O(n)\n\n### Common Patterns\n1. **Sliding Window** — Maintain a subset of elements as a "window"\n2. **Two Pointers** — Use two indices to traverse from different directions\n3. **Prefix Sums** — Precompute cumulative sums for range queries`,
          quiz: [
            {
              question: 'What is the time complexity of inserting an element at the beginning of an array?',
              options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
              correct: 2
            },
            {
              question: 'Which technique is best for finding the maximum sum subarray of size k?',
              options: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Recursion'],
              correct: 1
            }
          ]
        },
        {
          id: 'trees',
          name: 'Trees & Graphs',
          difficulty: 'Medium',
          progress: 45,
          flashcards: [
            { question: 'What is a Binary Search Tree (BST)?', answer: 'A BST is a binary tree where for each node, all elements in the left subtree are smaller and all elements in the right subtree are larger. This property enables O(log n) search, insertion, and deletion in balanced BSTs.' },
            { question: 'Difference between BFS and DFS?', answer: 'BFS explores level by level using a Queue (useful for shortest path). DFS goes deep using Stack/Recursion (useful for topological sort, cycle detection). BFS: O(V+E) time, O(V) space. DFS: O(V+E) time, O(V) space.' }
          ],
          notes: `## Trees & Graphs\n\n### Binary Tree Traversals\n- **Inorder** (Left, Root, Right) — gives sorted order for BST\n- **Preorder** (Root, Left, Right) — useful for serialization\n- **Postorder** (Left, Right, Root) — useful for deletion\n- **Level Order** — BFS using queue`,
          quiz: [
            {
              question: 'In a BST, what traversal gives elements in sorted order?',
              options: ['Preorder', 'Postorder', 'Inorder', 'Level Order'],
              correct: 2
            }
          ]
        },
        {
          id: 'dp',
          name: 'Dynamic Programming',
          difficulty: 'Hard',
          progress: 20,
          flashcards: [
            { question: 'What are the two approaches to Dynamic Programming?', answer: 'Top-Down (Memoization): Recursive approach with caching. Bottom-Up (Tabulation): Iterative approach building solutions from base cases. Both avoid redundant computation by storing sub-problem results.' }
          ],
          notes: `## Dynamic Programming\n\n### When to Use DP?\n1. **Optimal Substructure** — Optimal solution can be constructed from sub-problems\n2. **Overlapping Subproblems** — Same sub-problems are solved multiple times\n\n### Steps to Solve\n1. Define the state\n2. Write the recurrence relation\n3. Set base cases\n4. Decide top-down vs bottom-up\n5. Optimize space if possible`,
          quiz: [
            {
              question: 'Which property is NOT required for Dynamic Programming?',
              options: ['Optimal Substructure', 'Overlapping Subproblems', 'Greedy Choice Property', 'Both A and B are required'],
              correct: 2
            }
          ]
        }
      ]
    },
    system: {
      name: 'System Design',
      topics: [
        {
          id: 'basics',
          name: 'Fundamentals',
          difficulty: 'Medium',
          progress: 60,
          flashcards: [
            { question: 'What is CAP Theorem?', answer: 'CAP Theorem states that a distributed system can only guarantee two of three: Consistency (all nodes see the same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures). In practice, P is mandatory, so you choose between CP and AP.' }
          ],
          notes: `## System Design Fundamentals\n\n### Key Concepts\n- **Scalability** — Horizontal vs Vertical scaling\n- **Load Balancing** — Distribute traffic across servers\n- **Caching** — Reduce latency (Redis, Memcached)\n- **Database Sharding** — Partition data across databases`,
          quiz: []
        }
      ]
    },
    behavioral: {
      name: 'Behavioral',
      topics: [
        {
          id: 'star',
          name: 'STAR Method',
          difficulty: 'Easy',
          progress: 70,
          flashcards: [
            { question: 'What does STAR stand for?', answer: 'Situation: Set the scene. Task: Describe your responsibility. Action: Explain what you did. Result: Share the outcome with metrics if possible. This framework helps structure behavioral interview answers.' }
          ],
          notes: `## STAR Method\n\nThe STAR method is a structured approach to answering behavioral interview questions.\n\n### Components\n- **S**ituation — Background context\n- **T**ask — Your specific responsibility\n- **A**ction — Steps you took\n- **R**esult — Outcome and impact`,
          quiz: []
        }
      ]
    }
  };

  let currentTopic = null;

  // ---- Render Topic Sidebar ----
  function renderSidebar() {
    const container = document.getElementById('topicList');
    if (!container) return;

    let html = '';
    Object.entries(topicsData).forEach(([catKey, category]) => {
      html += `<div class="topic-category">
        <h4>${category.name}</h4>`;
      category.topics.forEach(topic => {
        html += `
          <div class="topic-item ${currentTopic?.id === topic.id ? 'active' : ''}"
               onclick="selectTopic('${catKey}', '${topic.id}')">
            <span>${topic.name}</span>
            <span class="progress-badge">${topic.progress}%</span>
          </div>`;
      });
      html += '</div>';
    });
    container.innerHTML = html;
  }

  // ---- Select Topic ----
  window.selectTopic = (catKey, topicId) => {
    const category = topicsData[catKey];
    if (!category) return;
    currentTopic = category.topics.find(t => t.id === topicId);
    if (!currentTopic) return;
    renderSidebar();
    renderContent();
  };

  // ---- Render Content ----
  function renderContent() {
    const container = document.getElementById('revisionContent');
    if (!container || !currentTopic) return;

    let html = `
      <div class="revision-content-header">
        <h1>${currentTopic.name}</h1>
        <div class="topic-meta">
          <span>📊 ${currentTopic.difficulty}</span>
          <span>🃏 ${currentTopic.flashcards.length} Flashcards</span>
          <span>📝 ${currentTopic.quiz.length} Quiz Questions</span>
        </div>
      </div>

      <!-- Flashcards -->
      <h2 style="color: white; font-size: 1.3rem; margin-bottom: 1rem;">🃏 Flashcards <span style="color: var(--neutral-500); font-size: 0.85rem;">(Click to flip)</span></h2>
      <div class="flashcard-container">
    `;

    currentTopic.flashcards.forEach((card, i) => {
      html += `
        <div class="flashcard" onclick="this.classList.toggle('flipped')" id="flashcard-${i}">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <h3>${card.question}</h3>
              <p class="hint">Click to reveal answer →</p>
            </div>
            <div class="flashcard-back">
              <p>${card.answer}</p>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // Notes
    if (currentTopic.notes) {
      html += `
        <div class="concept-notes card">
          ${renderMarkdown(currentTopic.notes)}
        </div>
      `;
    }

    // Quiz
    if (currentTopic.quiz.length) {
      html += `
        <div class="quiz-section">
          <h2 style="color: white; font-size: 1.3rem; margin-bottom: 1rem;">📝 Quick Quiz</h2>
      `;
      currentTopic.quiz.forEach((q, qi) => {
        html += `
          <div class="quiz-question card" id="quiz-${qi}">
            <h4>Q${qi + 1}. ${q.question}</h4>
            <div class="quiz-options">
        `;
        q.options.forEach((opt, oi) => {
          html += `
            <div class="quiz-option" onclick="checkAnswer(${qi}, ${oi}, ${q.correct})">
              <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
              <span>${opt}</span>
            </div>
          `;
        });
        html += `</div></div>`;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  }

  // ---- Simple Markdown Renderer ----
  function renderMarkdown(text) {
    return text
      .replace(/^### (.+)$/gm, '<h3 style="color: var(--primary-300); font-size: 1.1rem; margin: 1rem 0 0.5rem;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--neutral-100);">$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li style="color: var(--neutral-300); margin-left: 1rem; list-style: disc; margin-bottom: 0.25rem;">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li style="color: var(--neutral-300); margin-left: 1rem; list-style: decimal; margin-bottom: 0.25rem;">$2</li>')
      .replace(/\n\n/g, '<br><br>');
  }

  // ---- Check Quiz Answer ----
  window.checkAnswer = (qi, selected, correct) => {
    const questionEl = document.getElementById(`quiz-${qi}`);
    if (!questionEl) return;
    const options = questionEl.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
      opt.style.pointerEvents = 'none';
      if (i === correct) opt.classList.add('correct');
      if (i === selected && i !== correct) opt.classList.add('incorrect');
    });
  };

  // ---- Topic Search ----
  const searchInput = document.getElementById('topicSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.topic-item').forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
      });
    });
  }

  // Initialize
  renderSidebar();

  // Select first topic by default
  const firstCat = Object.keys(topicsData)[0];
  if (firstCat && topicsData[firstCat].topics.length) {
    window.selectTopic(firstCat, topicsData[firstCat].topics[0].id);
  }
});
