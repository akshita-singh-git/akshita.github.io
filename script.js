/* ================================================
   AKSHITA SINGH — AI + IoT Portfolio
   script.js
   Features:
     - Typewriter effect (home tagline)
     - Scroll-spy active nav
     - Navbar scroll style
     - Intersection Observer reveal animations
     - Animated skill bars
     - Simulated IoT sensor data (Chart.js)
     - Contact form validation & feedback
     - Mobile hamburger menu
   ================================================ */

'use strict';

/* ─────────────────────────────────────────────────
   1. TYPEWRITER EFFECT
───────────────────────────────────────────────── */
(function initTypewriter() {
  const el     = document.getElementById('typewriter');
  const phrases = [
    'Aspiring AI Engineer',
    'IoT Developer',
    'Python Enthusiast',
    'Data Viz Lover',
    'Sensor Whisperer 🤖',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let delay = deleting ? 50 : 100;

    // Finished typing — pause then delete
    if (!deleting && charIdx === current.length) {
      if (paused) { paused = false; deleting = true; delay = 1800; }
      else { paused = true; delay = 1800; }
    }

    // Finished deleting — move to next phrase
    if (deleting && charIdx === 0) {
      deleting   = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay      = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
})();


/* ─────────────────────────────────────────────────
   2. NAVBAR — scroll style + active link spy
───────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add scrolled class for background opacity
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActive();
  }, { passive: true });

  function highlightActive() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  highlightActive(); // run on load
})();


/* ─────────────────────────────────────────────────
   3. MOBILE HAMBURGER MENU
───────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ─────────────────────────────────────────────────
   4. INTERSECTION OBSERVER — reveal + skill bars
───────────────────────────────────────────────── */
(function initReveal() {
  // Generic reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Skill bars — animate width when in view
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const pct  = item.getAttribute('data-pct') + '%';
          item.querySelector('.skill-fill').style.width = pct;
          skillObserver.unobserve(item);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));
})();


/* ─────────────────────────────────────────────────
   5. SIMULATED IOT SENSOR DATA + CHART.JS
───────────────────────────────────────────────── */
(function initSensorData() {
  // Wait until Chart.js is loaded
  const MAX_POINTS = 20;

  // Initial data arrays
  const labels    = [];
  const tempData  = [];
  const waterData = [];

  // Seed 10 historical points
  for (let i = 10; i >= 0; i--) {
    const d = new Date(Date.now() - i * 2000);
    labels.push(formatTime(d));
    tempData.push(randomBetween(22, 38, tempData[tempData.length - 1] ?? 30));
    waterData.push(randomBetween(30, 90, waterData[waterData.length - 1] ?? 60));
  }

  // Chart config
  const ctx = document.getElementById('sensorChart');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempData,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,0.07)',
          tension: 0.45,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#00d4ff',
          borderWidth: 2,
          yAxisID: 'yTemp',
        },
        {
          label: 'Water Level (%)',
          data: waterData,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168,85,247,0.07)',
          tension: 0.45,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#a855f7',
          borderWidth: 2,
          yAxisID: 'yWater',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        legend: {
          labels: {
            color: '#6b8399',
            font: { family: "'Syne', sans-serif", size: 12 },
            boxWidth: 12,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(13,20,36,0.95)',
          titleColor: '#00d4ff',
          bodyColor: '#c8d8e8',
          borderColor: 'rgba(0,212,255,0.2)',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: '#6b8399', font: { size: 10 }, maxTicksLimit: 6 },
          grid:  { color: 'rgba(255,255,255,0.04)' },
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          min: 10, max: 50,
          ticks: { color: '#00d4ff', font: { size: 10 } },
          grid:  { color: 'rgba(255,255,255,0.04)' },
          title: { display: true, text: '°C', color: '#00d4ff', font: { size: 11 } },
        },
        yWater: {
          type: 'linear',
          position: 'right',
          min: 0, max: 100,
          ticks: { color: '#a855f7', font: { size: 10 } },
          grid:  { drawOnChartArea: false },
          title: { display: true, text: '%', color: '#a855f7', font: { size: 11 } },
        },
      },
    },
  });

  // Update stats display
  function updateStats(temp, water) {
    document.getElementById('tempVal').textContent  = temp.toFixed(1) + '°C';
    document.getElementById('waterVal').textContent = water.toFixed(0) + '%';
    const raining = water > 70 ? 'Detected 🌧️' : 'Clear ☀️';
    document.getElementById('rainVal').textContent  = raining;
  }

  updateStats(tempData.at(-1), waterData.at(-1));

  // Interval: push new point every 2 s
  setInterval(() => {
    const now   = new Date();
    const temp  = randomBetween(22, 38, tempData.at(-1));
    const water = randomBetween(30, 90, waterData.at(-1));

    labels.push(formatTime(now));
    tempData.push(temp);
    waterData.push(water);

    if (labels.length > MAX_POINTS) {
      labels.shift();
      tempData.shift();
      waterData.shift();
    }

    chart.update();
    updateStats(temp, water);
  }, 2000);

  // Helpers
  function formatTime(d) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  /**
   * Return a value within [min, max] with slight drift from previous value.
   * Simulates realistic sensor readings.
   */
  function randomBetween(min, max, prev) {
    const base   = prev ?? (min + max) / 2;
    const drift  = (Math.random() - 0.5) * (max - min) * 0.12; // max ±6% drift
    return Math.min(max, Math.max(min, base + drift));
  }
})();


/* ─────────────────────────────────────────────────
   6. CONTACT FORM — client-side validation
───────────────────────────────────────────────── */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate async send
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      showFeedback('🎉 Message sent! I\'ll be in touch soon.', 'success');
      form.reset();
      submitBtn.textContent = 'Send Message 🚀';
      submitBtn.disabled    = false;
    }, 1400);
  });

  function showFeedback(msg, type) {
    feedback.textContent  = msg;
    feedback.className    = 'form-feedback ' + type;
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
