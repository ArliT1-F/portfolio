/* ============================================================
   CUSTOM CURSOR — O2: throttled via rAF
============================================================ */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
 
let cursorScheduled = false;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (!cursorScheduled) {
    cursorScheduled = true;
    requestAnimationFrame(() => {
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      cursorScheduled = false;
    });
  }
});
 
/*
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();
*/



/* ============================================================
   NAV SCROLL STATE
============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});
 
/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));
 
/* ============================================================
   HERO PARTICLE CANVAS
============================================================ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
 
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
 
class Particle {
  constructor() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height * 0.8;
    this.size   = Math.random() * 2.2 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.4 + 0.05;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle   = '#c8ff00';
    ctx.globalAlpha = 0.45;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
 
const particles = [];
for (let i = 0; i < 160; i++) particles.push(new Particle());
 
/* ============================================================
   SKILL BARS
============================================================ */
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
          const width = bar.getAttribute('data-width');
          if (width) setTimeout(() => { bar.style.width = width + '%'; }, i * 80);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' });
  skillObserver.observe(skillsSection);
}
 
/* ============================================================
   HAMBURGER MENU
============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
 
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
 
/* ============================================================
   FLOATING KATAKANA CANVAS
============================================================ */
const kataCanvas = document.getElementById('floating-katakana');
const kataCtx    = kataCanvas.getContext('2d');
 
function resizeKata() {
  kataCanvas.width  = window.innerWidth;
  kataCanvas.height = window.innerHeight;
}
resizeKata();
window.addEventListener('resize', resizeKata);
 
const katakanaChars = [
  'コード', '構築', 'ネオン', '東京', '未来', '回路',
  '電脳', '影', '光', '雨', '零', '一', '二', '三',
  '四', '五', '六', '七', '八', '九', '十'
];
 
class Fragment {
  constructor() {
    this.x       = Math.random() * kataCanvas.width;
    this.y       = Math.random() * kataCanvas.height;
    this.size    = Math.random() * 18 + 11;
    this.speed   = Math.random() * 0.25 + 0.1;
    this.text    = katakanaChars[Math.floor(Math.random() * katakanaChars.length)];
    this.opacity = Math.random() * 0.25 + 0.15;
  }
  update() {
    this.y      += this.speed;
    this.opacity = 0.2 + Math.sin(Date.now() / 2000) * 0.1;
    if (this.y > kataCanvas.height) this.y = -30;
  }
  draw() {
    kataCtx.save();
    kataCtx.globalAlpha = this.opacity;
    kataCtx.fillStyle   = '#c8ff00';
    kataCtx.shadowBlur  = 18;
    kataCtx.shadowColor = '#c8ff00';
    kataCtx.font        = `${this.size}px 'Space Mono', monospace`;
    kataCtx.fillText(this.text, this.x, this.y);
    kataCtx.restore();
  }
}
 
const fragments = [];
for (let i = 0; i < 18; i++) fragments.push(new Fragment());
 
/* ============================================================
   O3. PAUSE CANVAS ANIMATIONS when tab is hidden
============================================================ */
let animPaused = false;
document.addEventListener('visibilitychange', () => {
  animPaused = document.hidden;
});
 
function animateParticles() {
  if (!animPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
  }
  requestAnimationFrame(animateParticles);
}
 
function animateKata() {
  if (!animPaused) {
    kataCtx.clearRect(0, 0, kataCanvas.width, kataCanvas.height);
    fragments.forEach(f => { f.update(); f.draw(); });
  }
  requestAnimationFrame(animateKata);
}
 
/*
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();
*/

function loop() {
  if (!animPaused) {

    // cursor ring
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';;

    // particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // katakana
    kataCtx.clearRect(0, 0, kataCanvas.width, kataCanvas.height);
    fragments.forEach(f => {
      f.update();
      f.draw();
    });
  }

  requestAnimationFrame(loop);
}
loop();
 
/* ============================================================
   A4. SPLASH SCREEN
============================================================ */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('splash-out');
      setTimeout(() => splash.remove(), 900);
    }, 1000);
  }
});
 
/* ============================================================
   A1. TYPEWRITER EFFECT — hero subtitle
============================================================ */
const subtitleEl = document.querySelector('.hero-subtitle');
if (subtitleEl) {
  const lines = [
    'Systems programmer & full-stack builder.',
    'C · Python · Low-level systems · ML tooling'
  ];
  subtitleEl.innerHTML = '';
  let li = 0, ci = 0;
  let currentLine = document.createElement('span');
  subtitleEl.appendChild(currentLine);
 
  function type() {
    if (li >= lines.length) return;
    if (ci < lines[li].length) {
      currentLine.textContent += lines[li][ci++];
      setTimeout(type, 28);
    } else {
      li++;
      if (li < lines.length) {
        subtitleEl.appendChild(document.createElement('br'));
        currentLine = document.createElement('span');
        subtitleEl.appendChild(currentLine);
        ci = 0;
        setTimeout(type, 320);
      }
    }
  }
  setTimeout(type, 300); // start after splash clears
}
 
/* ============================================================
   A2. MAGNETIC TILT on project cards
============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});
 
/* ============================================================
   A3. ACTIVE NAV LINK on scroll
============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
 
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('nav-active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-active');
    }
  });
}, { threshold: 0.4 });
 
sections.forEach(s => sectionObserver.observe(s));
 
/* ============================================================
   O1. LAZY-LOAD project thumbnails
============================================================ */
document.querySelectorAll('.lazy-bg').forEach(el => {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bg = entry.target.getAttribute('data-bg');
        entry.target.style.background = `url('${bg}') center/cover`;
        imgObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });
  imgObserver.observe(el);
});
 
/* ============================================================
   P1. LIVE GITHUB STARS + FORKS
============================================================ */
function renderStats(cardIndex, data) {
    const snippets = document.querySelectorAll('.repo-stats');
    if (!snippets[cardIndex]) return;

    const stats = snippets[cardIndex].querySelectorAll('.repo-stat');

    if (stats[0]) stats[0].innerHTML = `${starSVG} ${data.stargazers_count ?? 0}`;
  if (stats[1]) stats[1].innerHTML = `${forkSVG} ${data.forks_count ?? 0}`;
}

[
    { slug: 'ArliT1-F/web-tool', card: 0 },
    { slug: 'ArliT1-F/terminal-portfolio', card: 1 },
    { slug: 'ArliT1-F/desktop-portfolio', card: 2 },
].forEach(({ slug, card }) => {
    const cacheKey = `repo_${slug}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        renderStats(card, JSON.parse(cached));
        return;
    }

    fetch(`https://api.github.com/repos/${slug}`)
        .then(r => r.json())
        .then(data => {
            if (!data || data.message) return;
            localStorage.setItem(cacheKey, JSON.stringify(data));
            renderStats(card, data);
        })
        .catch(() => {});
});
 
/* ============================================================
   P2. EMAILJS CONTACT FORM
   Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with values
   from your EmailJS dashboard at https://emailjs.com
============================================================ */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn    = contactForm.querySelector('.form-submit');
    status.textContent = 'Sending...';
    status.style.color = 'var(--muted)';
    btn.disabled = true;
 
    emailjs.sendForm('service_i4vsvd1', 'template_bflokzn', contactForm)
      .then(() => {
        status.textContent = '✓ Message sent!';
        status.style.color = 'var(--accent)';
        contactForm.reset();
        btn.disabled = false;
      })
      .catch(() => {
        status.textContent = '✗ Failed — try emailing directly.';
        status.style.color = '#ff4444';
        btn.disabled = false;
      });
  });
}
 
/* ============================================================
   P3. COPY EMAIL BUTTON
============================================================ */
const copyBtn = document.getElementById('copy-email-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('arliturka@gmail.com').then(() => {
      copyBtn.textContent = '✓ Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy Email';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });
}
 
/* ============================================================
   U1. KEYBOARD NAVIGATION — restore cursor + focus rings
============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});
 
/* ============================================================
   U3. MOBILE NAV — close on link click
============================================================ */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
 