/* ============================================
   INVOXIA - Main Application Logic
   Shared utilities, routing, and navbar logic
   ============================================ */

// ---- Navbar Scroll Effect ----
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove('open');
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.observe-scroll').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Animate counters on hero stats
  const statElements = document.querySelectorAll('.hero-stat h3[data-count]');
  if (statElements.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, 16);
    };

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach(el => statObserver.observe(el));
  }
});

// ---- Utility Functions ----
const Utils = {
  // Debounce helper
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Format time (seconds to MM:SS)
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // Simple toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 14px 24px;
      background: ${type === 'success' ? 'rgba(52, 211, 153, 0.9)' :
                     type === 'error' ? 'rgba(251, 113, 133, 0.9)' :
                     'rgba(99, 102, 241, 0.9)'};
      color: white;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 500;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      animation: fadeInUp 0.3s ease-out;
      font-family: 'Inter', sans-serif;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// Make Utils globally accessible
window.InvoxiaUtils = Utils;
