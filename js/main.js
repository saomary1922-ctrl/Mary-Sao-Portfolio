/* ============================================
   Mary SAO - Portfolio Website JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // ===== DOM Elements =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contact-form');
  const skillBars = document.querySelectorAll('.skill-progress');
  const statNumbers = document.querySelectorAll('.stat-number');
  const fadeElements = document.querySelectorAll('.fade-in');

  // ===== Navigation =====

  // Toggle mobile menu
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Active nav link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(function (section) {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Navbar background on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ===== Skill Bar Animations =====

  function animateSkillBars() {
    skillBars.forEach(function (bar) {
      const width = bar.getAttribute('data-width');
      bar.style.width = width + '%';
    });
  }

  // ===== Stat Counter Animation =====

  function animateCounters() {
    statNumbers.forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 40);
    });
  }

  // ===== Scroll-based Animations (Intersection Observer) =====

  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });

    // Animate skill bars when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      skillsObserver.observe(skillsSection);
    }

    // Animate counters when about section is visible
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const aboutObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            aboutObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      aboutObserver.observe(aboutSection);
    }
  }

  // ===== Contact Form Handling =====

  function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!validateForm(name, email, subject, message)) {
        return;
      }

      // Build thank you page URL with query params
      const params = new URLSearchParams({
        name: name,
        email: email,
        subject: subject
      });

      window.location.href = 'pages/thank-you.html?' + params.toString();
    });
  }

  function validateForm(name, email, subject, message) {
    let isValid = true;

    // Clear previous errors
    clearFormErrors();

    if (!name) {
      showError('name', 'Name is required');
      isValid = false;
    }

    if (!email) {
      showError('email', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email');
      isValid = false;
    }

    if (!subject) {
      showError('subject', 'Subject is required');
      isValid = false;
    }

    if (!message) {
      showError('message', 'Message is required');
      isValid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const existingError = field.parentElement.querySelector('.error-message');

    if (!existingError) {
      const error = document.createElement('span');
      error.className = 'error-message';
      error.textContent = message;
      field.parentElement.appendChild(error);
    }

    field.style.borderColor = 'var(--error)';
  }

  function clearFormErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(function (error) {
      error.remove();
    });

    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(function (input) {
      input.style.borderColor = '';
    });
  }

  // ===== Back to Top Button =====

  function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('title', 'Back to Top');
    backToTop.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== Typing Effect in Hero =====

  function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.innerHTML;
    heroTitle.textContent = '';

    let i = 0;
    function type() {
      if (i < originalText.length) {
        // Handle HTML span tags
        if (originalText[i] === '<') {
          const endIndex = originalText.indexOf('>', i);
          heroTitle.innerHTML += originalText.substring(i, endIndex + 1);
          i = endIndex + 1;
        } else {
          heroTitle.textContent += originalText[i];
          i++;
        }
        setTimeout(type, 50);
      }
    }

    // Start typing after a short delay
    setTimeout(type, 800);
  }

  // ===== Initialize Everything =====

  handleNavbarScroll();
  setupSmoothScroll();
  setupScrollAnimations();
  setupContactForm();
  setupBackToTop();

  // Navbar scroll listener
  window.addEventListener('scroll', function () {
    handleNavbarScroll();
    updateActiveNavLink();
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // Initial observer trigger for elements already in view
  window.addEventListener('load', function () {
    updateActiveNavLink();
  });

});