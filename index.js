"use strict";
/* =====================================================
   FORGE & FADE — Premium Barbershop
   script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const heroImages = [
    'images/hero/hero-1.jpg',  
    'images/hero/hero-2.jpg',
    'images/hero/hero-3.jpg', 
  ];

  const slides    = document.querySelectorAll('.hero-slide');
  const dots      = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideTimer;

  /**
   * Activate a specific slide by index.
   * Removes .active from all slides/dots then adds to the target.
   */
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  /** Advance to the next slide */
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  /** Start auto-rotation */
  function startSlideshow() {
    slideTimer = setInterval(nextSlide, 5000);
  }

  /** Reset timer (called when user manually picks a dot) */
  function resetSlideshow() {
    clearInterval(slideTimer);
    startSlideshow();
  }

  // Wire up dot buttons
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetSlideshow();
    });
  });

  // Preload hero images so first swap is instant
  heroImages.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      // When real image loads, set it as background on the slide
      slides[i].style.backgroundImage = `url('${src}')`;
      slides[i].style.backgroundSize  = 'cover';
      slides[i].style.backgroundPosition = 'center';
    };
  });

  // Start the slideshow
  startSlideshow();

  // Pause on hover (good UX)
  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', () => clearInterval(slideTimer));
  heroSection.addEventListener('mouseleave', startSlideshow);


  /* ──────────────────────────────────────────────────
     2. STICKY NAVBAR ON SCROLL
  ────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    const scrolled = window.scrollY > 80;
    navbar.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load in case page starts mid-scroll


  /* ──────────────────────────────────────────────────
     3. SMOOTH SCROLLING FOR NAV LINKS
  ────────────────────────────────────────────────── */
  const NAV_HEIGHT = 80; // pixels — adjust if you change navbar height

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });


  /* ──────────────────────────────────────────────────
     4. MOBILE HAMBURGER MENU
  ────────────────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose  = document.getElementById('mobileClose');

  function openMobileMenu() {
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileOverlay.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  mobileClose.addEventListener('click', closeMobileMenu);

  // Close on overlay background tap
  mobileOverlay.addEventListener('click', e => {
    if (e.target === mobileOverlay) closeMobileMenu();
  });


  /* ──────────────────────────────────────────────────
     5. SCROLL REVEAL ANIMATIONS
     ─ Elements with .reveal fade up when they enter the viewport
  ────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children of a grid for a cascading effect
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        const index    = Array.from(siblings).indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.08}s`;

        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────────────
     6. BOOKING FORM — SUBMIT HANDLER
     ─ Shows a confirmation message on submit
     ─ Replace with your actual backend / booking system
  ────────────────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn   = document.getElementById('submitBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      if (!name) {
        alert('Please enter your name.');
        return;
      }

      // Simulate confirmation
      submitBtn.textContent = '✓ Booking Confirmed!';
      submitBtn.style.background   = '#4a8c5c';
      submitBtn.style.borderColor  = '#4a8c5c';
      submitBtn.disabled           = true;

      setTimeout(() => {
        bookingForm.reset();
        submitBtn.textContent    = 'Confirm Booking';
        submitBtn.style.background  = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled          = false;
      }, 4000);
    });
  }


  /* ──────────────────────────────────────────────────
     7. GALLERY — CURSOR ZOOM FEEDBACK
     ─ Subtle scale indicator on gallery image hover
  ────────────────────────────────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });


  /* ──────────────────────────────────────────────────
     8. ACTIVE NAV LINK ON SCROLL (Scroll Spy)
     ─ Highlights the nav link for the section in view
  ────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - NAV_HEIGHT - 40;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--copper)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

});



