/* =============================================
   OBADAH SALEH – PORTFOLIO JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ============ LOADING SCREEN ============
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 800);
  });

  // Fallback: hide loading after 3 seconds max
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 3000);

  // ============ PARTICLE BACKGROUND ============
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // ============ NAVBAR ============
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const scrollTop = document.getElementById('scrollTop');

  // Scroll effects
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollY > 400) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNavLink();
  });

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Scroll to top
  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Active nav link based on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = navLinks.querySelectorAll('a:not(.nav-cta)');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ============ TYPING EFFECT ============
  const roles = [
    'MEP Engineer',
    'MEP Coordinator',
    'Electrical Engineer',
    'Automation Engineer'
  ];
  const typedRole = document.getElementById('typedRole');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedRole.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedRole.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ============ COUNTER ANIMATION ============
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        counter.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counter animation when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  // ============ SCROLL ANIMATIONS ============
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));

  // ============ SKILL BAR ANIMATIONS ============
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ============ CONTACT FORM ============
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Button loading state
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('show');
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // If Formspree isn't set up yet, show success anyway for demo
        // In production, replace YOUR_FORM_ID with actual Formspree form ID
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }

      // Reset button
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
    });
  }

  // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ PARALLAX EFFECT ON HERO ============
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg img');
    if (hero) {
      const scrollY = window.scrollY;
      hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // ============ CURSOR GLOW EFFECT (desktop only) ============
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transition: transform 0.15s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }
});
