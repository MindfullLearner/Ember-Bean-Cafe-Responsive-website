/* ============================================================
   EMBER & BEAN — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- 1. MOBILE HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      hamburger.querySelector('.hamburger-icon').textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('.hamburger-icon').textContent = '☰';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('.hamburger-icon').textContent = '☰';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('.hamburger-icon').textContent = '☰';
        hamburger.focus();
      }
    });

    // Auto-close menu if viewport resizes to tablet/desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('.hamburger-icon').textContent = '☰';
      }
    });
  }


  /* ---- 2. CTA BUTTON ALERT ---- */
  const CTA_MESSAGE = "Thanks for stopping by Ember & Bean! ☕ We'll brew something special for you.";

  document.querySelectorAll('.cta-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      alert(CTA_MESSAGE);
    });
  });


  /* ---- 3. ACTIVE NAVIGATION HIGHLIGHT (scroll-based) ---- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function setActiveLink(id) {
    navItems.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // IntersectionObserver for section tracking
  const observerOptions = {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Default — highlight Home on load
  setActiveLink('home');


  /* ---- 4. SMOOTH SCROLL for internal anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', function () {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });


  /* ---- 5. CARD HOVER KEYBOARD SUPPORT ---- */
  document.querySelectorAll('.brew-card, .visual-card').forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const btn = card.querySelector('.btn');
        if (btn) btn.click();
      }
    });
  });

})();
