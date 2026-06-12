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


  /* ---- 6. CONTACT FORM VALIDATION ---- */
  const submitBtn   = document.getElementById('cf-submit');
  const formSuccess = document.getElementById('form-success');
  const messageArea = document.getElementById('cf-message');
  const charCount   = document.getElementById('cf-message-count');
  const MAX_CHARS   = 500;

  // Helpers
  function getEl(id)  { return document.getElementById(id); }
  function showError(inputEl, errorId, msg) {
    inputEl.classList.add('input-error');
    inputEl.classList.remove('input-success');
    inputEl.setAttribute('aria-invalid', 'true');
    getEl(errorId).textContent = msg;
  }
  function clearError(inputEl, errorId) {
    inputEl.classList.remove('input-error');
    inputEl.classList.add('input-success');
    inputEl.setAttribute('aria-invalid', 'false');
    getEl(errorId).textContent = '';
  }
  function clearAll(inputEl, errorId) {
    inputEl.classList.remove('input-error', 'input-success');
    inputEl.removeAttribute('aria-invalid');
    getEl(errorId).textContent = '';
  }

  // Validators
  function validateName() {
    var el  = getEl('cf-name');
    var val = el.value.trim();
    if (!val) {
      showError(el, 'cf-name-error', 'Full name is required.'); return false;
    }
    if (val.length < 2) {
      showError(el, 'cf-name-error', 'Name must be at least 2 characters.'); return false;
    }
    if (!/^[a-zA-Z\s'.'-]+$/.test(val)) {
      showError(el, 'cf-name-error', 'Name can only contain letters and spaces.'); return false;
    }
    clearError(el, 'cf-name-error'); return true;
  }

  function validateEmail() {
    var el  = getEl('cf-email');
    var val = el.value.trim();
    var re  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!val) {
      showError(el, 'cf-email-error', 'Email address is required.'); return false;
    }
    if (!re.test(val)) {
      showError(el, 'cf-email-error', 'Please enter a valid email (e.g. you@example.com).'); return false;
    }
    clearError(el, 'cf-email-error'); return true;
  }

  function validatePhone() {
    var el  = getEl('cf-phone');
    var val = el.value.trim();
    if (!val) { clearAll(el, 'cf-phone-error'); return true; } // optional
    var re  = /^[+]?[\d\s\-().]{7,15}$/;
    if (!re.test(val)) {
      showError(el, 'cf-phone-error', 'Enter a valid phone number (7–15 digits).'); return false;
    }
    clearError(el, 'cf-phone-error'); return true;
  }

  function validateSubject() {
    var el  = getEl('cf-subject');
    if (!el.value) {
      showError(el, 'cf-subject-error', 'Please select a subject.'); return false;
    }
    clearError(el, 'cf-subject-error'); return true;
  }

  function validateMessage() {
    var el  = getEl('cf-message');
    var val = el.value.trim();
    if (!val) {
      showError(el, 'cf-message-error', 'Message cannot be empty.'); return false;
    }
    if (val.length < 10) {
      showError(el, 'cf-message-error', 'Message must be at least 10 characters.'); return false;
    }
    if (val.length > MAX_CHARS) {
      showError(el, 'cf-message-error', 'Message cannot exceed ' + MAX_CHARS + ' characters.'); return false;
    }
    clearError(el, 'cf-message-error'); return true;
  }

  function validateConsent() {
    var el = getEl('cf-consent');
    if (!el.checked) {
      getEl('cf-consent-error').textContent = 'You must agree before sending.';
      return false;
    }
    getEl('cf-consent-error').textContent = '';
    return true;
  }

  // Character counter
  if (messageArea && charCount) {
    messageArea.addEventListener('input', function () {
      var len = messageArea.value.length;
      charCount.textContent = len + ' / ' + MAX_CHARS;
      if (len > MAX_CHARS) {
        charCount.classList.add('over-limit');
      } else {
        charCount.classList.remove('over-limit');
      }
    });
  }

  // Live validation on blur (after first interaction)
  function addBlurValidation(id, fn) {
    var el = getEl(id);
    if (!el) return;
    el.addEventListener('blur', fn);
    el.addEventListener('input', function () {
      if (el.classList.contains('input-error')) fn();
    });
  }

  addBlurValidation('cf-name',    validateName);
  addBlurValidation('cf-email',   validateEmail);
  addBlurValidation('cf-phone',   validatePhone);
  addBlurValidation('cf-subject', validateSubject);
  addBlurValidation('cf-message', validateMessage);

    // ============================================================
  // SUBMIT HANDLER — BACKEND API INTEGRATION
  // ============================================================
  
  if (submitBtn) {
    submitBtn.addEventListener('click', async function () {
      // Validate all fields
      const isValid = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validateSubject(),
        validateMessage(),
        validateConsent()
      ].every(Boolean);

      if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.input-error, .form-checkbox.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Collect form data
      const formData = {
        name: document.getElementById('cf-name').value.trim(),
        email: document.getElementById('cf-email').value.trim(),
        phone: document.getElementById('cf-phone').value.trim() || null,
        subject: document.getElementById('cf-subject').value,
        message: document.getElementById('cf-message').value.trim()
      };

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Sending...';

      try {
        // Send to backend API
        const response = await fetch('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          // Reset form fields
          ['cf-name', 'cf-email', 'cf-phone', 'cf-subject', 'cf-message'].forEach(function(id) {
            const el = document.getElementById(id);
            if (el) {
              el.value = '';
              el.classList.remove('input-error', 'input-success');
              el.removeAttribute('aria-invalid');
            }
          });
          const consentEl = document.getElementById('cf-consent');
          if (consentEl) consentEl.checked = false;
          
          if (charCount) charCount.textContent = '0 / ' + MAX_CHARS;
          
          // Clear all errors
          ['cf-name-error', 'cf-email-error', 'cf-phone-error', 'cf-subject-error', 'cf-message-error', 'cf-consent-error']
            .forEach(function(id) {
              const el = document.getElementById(id);
              if (el) el.textContent = '';
            });

          // Show success message
          if (formSuccess) {
            formSuccess.textContent = result.message || '☕ Thank you! We\'ll brew a reply and get back to you soon.';
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Auto hide success after 5 seconds
          setTimeout(function() {
            if (formSuccess) formSuccess.hidden = true;
          }, 5000);
          
        } else {
          // Show error from backend
          if (formSuccess) {
            formSuccess.textContent = '❌ ' + (result.message || 'Something went wrong. Please try again.');
            formSuccess.hidden = false;
            formSuccess.style.backgroundColor = '#f8d7da';
            formSuccess.style.color = '#721c24';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          // Display field errors if any
          if (result.errors && Array.isArray(result.errors)) {
            const errorContainer = document.getElementById('cf-message-error');
            if (errorContainer) {
              errorContainer.textContent = result.errors.join(', ');
              errorContainer.style.display = 'block';
            }
          }
        }
        
      } catch (error) {
        console.error('Contact form error:', error);
        if (formSuccess) {
          formSuccess.textContent = '❌ Connection error. Make sure backend server is running on http://localhost:3000';
          formSuccess.hidden = false;
          formSuccess.style.backgroundColor = '#f8d7da';
          formSuccess.style.color = '#721c24';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Auto hide error after 5 seconds
        setTimeout(function() {
          if (formSuccess && formSuccess.textContent.includes('❌')) {
            formSuccess.hidden = true;
          }
        }, 5000);
      }
    });
  }

})();
