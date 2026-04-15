import './style.css'


send({
  route: window.location.pathname,
  href: window.location.href,
  type: 'pageview',
});

/* ============================================================
   CUSTOM CURSOR — throttled via rAF
============================================================ */
const dot  = document.getElementById('cursor-dot')
const ring = document.getElementById('cursor-ring')
let mx = 0, my = 0, rx = 0, ry = 0, cursorScheduled = false

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY
  if (!cursorScheduled) {
    cursorScheduled = true
    requestAnimationFrame(() => {
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
      cursorScheduled = false
    })
  }
})

;(function animRing() {
  rx += (mx - rx) * 0.12
  ry += (my - ry) * 0.12
  ring.style.left = rx + 'px'
  ring.style.top  = ry + 'px'
  requestAnimationFrame(animRing)
})()

/* ── cursor ring expand on hover ── */
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button')) {
    ring.style.width  = '44px'
    ring.style.height = '44px'
    ring.style.opacity = '1'
  } else {
    ring.style.width  = '30px'
    ring.style.height = '30px'
    ring.style.opacity = '0.5'
  }
})

/* ============================================================
   NAV SCROLL STATE
============================================================ */
const nav = document.getElementById('nav')
window.addEventListener('scroll', () => {
  nav.classList.toggle('border-border', window.scrollY > 30)
  nav.classList.toggle('border-transparent', window.scrollY <= 30)
})

/* ============================================================
   HAMBURGER
============================================================ */
const hamburger = document.getElementById('hamburger')
const navLinks  = document.getElementById('nav-links')

hamburger.addEventListener('click', () => navLinks.classList.toggle('active'))
document.querySelectorAll('#nav-links a').forEach(l => {
  l.addEventListener('click', () => navLinks.classList.remove('active'))
})

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      revealObserver.unobserve(e.target)
    }
  })
}, { threshold: 0.12 })
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

/* ============================================================
   ACTIVE NAV LINK
============================================================ */
const navAnchors = document.querySelectorAll('.nav-link')
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('nav-active'))
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`)
      if (active) active.classList.add('nav-active')
    }
  })
}, { threshold: 0.4 })
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s))

/* ============================================================
   HERO PARTICLE CANVAS
============================================================ */
const canvas = document.getElementById('particles')
const ctx    = canvas.getContext('2d')

const resizeCanvas = () => { canvas.width = innerWidth; canvas.height = innerHeight }
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

class Particle {
  constructor() { this.reset() }
  reset() {
    this.x      = Math.random() * canvas.width
    this.y      = Math.random() * canvas.height * 0.8
    this.size   = Math.random() * 2.2 + 0.5
    this.speedX = Math.random() * 0.6 - 0.3
    this.speedY = Math.random() * 0.4 + 0.05
  }
  update() {
    this.x += this.speedX; this.y += this.speedY
    if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1
    if (this.y < 0 || this.y > canvas.height)  this.speedY *= -1
  }
  draw() {
    ctx.fillStyle = '#c8ff00'; ctx.globalAlpha = 0.45
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}
const particles = Array.from({ length: 160 }, () => new Particle())

/* ============================================================
   FLOATING KATAKANA CANVAS
============================================================ */
const kataCanvas = document.getElementById('floating-katakana')
const kataCtx    = kataCanvas.getContext('2d')
const resizeKata = () => { kataCanvas.width = innerWidth; kataCanvas.height = innerHeight }
resizeKata()
window.addEventListener('resize', resizeKata)

const CHARS = ['コード','構築','ネオン','東京','未来','回路','電脳','影','光','雨','零','一','二','三','四','五','六','七','八','九','十']

class Fragment {
  constructor() { this.init() }
  init() {
    this.x    = Math.random() * kataCanvas.width
    this.y    = Math.random() * kataCanvas.height
    this.size = Math.random() * 18 + 11
    this.speed = Math.random() * 0.6 + 0.3
    this.text = CHARS[Math.floor(Math.random() * CHARS.length)]
    this.opacity = Math.random() * 0.6 + 0.3
  }
  update() {
    this.y += this.speed
    this.opacity = Math.sin(Date.now() / 1200) * 0.3 + 0.6
    if (this.y > kataCanvas.height) this.y = -30
  }
  draw() {
    kataCtx.save()
    kataCtx.globalAlpha = this.opacity
    kataCtx.fillStyle   = '#c8ff00'
    kataCtx.shadowBlur  = 18
    kataCtx.shadowColor = '#c8ff00'
    kataCtx.font        = `${this.size}px 'Space Mono', monospace`
    kataCtx.fillText(this.text, this.x, this.y)
    kataCtx.restore()
  }
}
const fragments = Array.from({ length: 45 }, () => new Fragment())

/* ============================================================
   O3. PAUSE when tab hidden
============================================================ */
let animPaused = false
document.addEventListener('visibilitychange', () => { animPaused = document.hidden })

const loop = () => {
  if (!animPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => { p.update(); p.draw() })
    kataCtx.clearRect(0, 0, kataCanvas.width, kataCanvas.height)
    fragments.forEach(f => { f.update(); f.draw() })
  }
  requestAnimationFrame(loop)
}
loop()

/* ============================================================
   SKILL BARS
============================================================ */
const skillsSection = document.getElementById('skills')
if (skillsSection) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
          const w = bar.getAttribute('data-width')
          if (w) setTimeout(() => { bar.style.width = w + '%' }, i * 80)
        })
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' }).observe(skillsSection)
}

/* ============================================================
   A4. SPLASH
============================================================ */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash')
  if (!splash) return
  setTimeout(() => {
    splash.classList.add('splash-out')
    setTimeout(() => splash.remove(), 800)
  }, 1000)
})

/* ============================================================
   A1. TYPEWRITER
============================================================ */
const subtitleEl = document.querySelector('.hero-subtitle')
if (subtitleEl) {
  const lines = [
    'Systems programmer & full-stack builder.',
    'C · Python · Low-level systems · ML tooling'
  ]
  subtitleEl.innerHTML = ''
  let li = 0, ci = 0
  let cur = document.createElement('span')
  subtitleEl.appendChild(cur)

  const type = () => {
    if (li >= lines.length) return
    if (ci < lines[li].length) {
      cur.textContent += lines[li][ci++]
      setTimeout(type, 28)
    } else {
      li++
      if (li < lines.length) {
        subtitleEl.appendChild(document.createElement('br'))
        cur = document.createElement('span')
        subtitleEl.appendChild(cur)
        ci = 0
        setTimeout(type, 320)
      }
    }
  }
  setTimeout(type, 1900)
}

/* ============================================================
   A2. MAGNETIC TILT
============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(8px)`
    card.style.transition = 'transform 0.05s'
  })
  card.addEventListener('mouseleave', () => {
    card.style.transform  = ''
    card.style.transition = 'transform 0.4s ease'
  })
})

/* ============================================================
   O1. LAZY-LOAD thumbnails
============================================================ */
document.querySelectorAll('.lazy-bg').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bg = entry.target.getAttribute('data-bg')
        entry.target.style.backgroundImage   = `url('${bg}')`
        entry.target.style.backgroundSize    = 'cover'
        entry.target.style.backgroundPosition = 'center'
        obs.unobserve(entry.target)
      }
    })
  }, { rootMargin: '200px' }).observe(el)
})

/* ============================================================
   P1. GITHUB API — stars, forks, issues, last commit, language
============================================================ */
const STAR_SVG   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
const FORK_SVG   = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 5C7 3.9 7.9 3 9 3s2 .9 2 2c0 .74-.4 1.39-1 1.73V14h3c.28-.96 1.15-1.63 2.19-1.63 1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25c-1.06 0-1.95-.72-2.19-1.69H8.88c-.42 0-.76-.34-.76-.75V6.73C7.52 6.39 7 5.74 7 5z"/></svg>`
const ISSUE_SVG  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
const CLOCK_SVG  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
const LANG_COLORS = { JavaScript:'#f1e05a', Python:'#3572A5', C:'#555599', TypeScript:'#2b7489', HTML:'#e34c26', CSS:'#563d7c', Shell:'#89e051' }

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff/86400)}d ago`
  return `${Math.floor(diff/2592000)}mo ago`
}

async function fetchRepoStats(slug, container) {
  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${slug}`),
      fetch(`https://api.github.com/repos/${slug}/commits?per_page=1`)
    ])
    const repo    = await repoRes.json()
    const commits = await commitsRes.json()

    const lastCommit = commits[0]?.commit?.author?.date ?? null
    const lang       = repo.language ?? 'Unknown'
    const langColor  = LANG_COLORS[lang] ?? '#888'

    // Update language dot in header
    const langEl = container.querySelector('.repo-lang')
    if (langEl) langEl.innerHTML = `<span class="w-2 h-2 rounded-full inline-block" style="background:${langColor}"></span>${lang}`

    const stars  = container.querySelector('.repo-stat-stars')
    const forks  = container.querySelector('.repo-stat-forks')
    const issues = container.querySelector('.repo-stat-issues')
    const commit = container.querySelector('.repo-stat-commit')

    if (stars)  stars.innerHTML  = `${STAR_SVG} ${repo.stargazers_count ?? 0}`
    if (forks)  forks.innerHTML  = `${FORK_SVG} ${repo.forks_count ?? 0}`
    if (issues) issues.innerHTML = `${ISSUE_SVG} ${repo.open_issues_count ?? 0} issues`
    if (commit && lastCommit) commit.innerHTML = `${CLOCK_SVG} ${timeAgo(lastCommit)}`
    else if (commit) commit.remove()

  } catch {
    // fail silently — skeletons remain as fallback
  }
}

document.querySelectorAll('.repo-stats-card').forEach(card => {
  const slug = card.getAttribute('data-repo')
  if (slug) fetchRepoStats(slug, card)
})

/* ============================================================
   P2. EMAILJS CONTACT FORM
   Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID below
============================================================ */
const contactForm = document.getElementById('contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault()
    const status = document.getElementById('form-status')
    const btn    = contactForm.querySelector('.form-submit')
    status.textContent = 'Sending...'
    status.style.color = '#555'
    btn.disabled = true

    try {
      await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
      status.textContent = '✓ Message sent!'
      status.style.color = '#c8ff00'
      contactForm.reset()
    } catch {
      status.textContent = '✗ Failed — try emailing directly.'
      status.style.color = '#ff4444'
    } finally {
      btn.disabled = false
    }
  })
}

/* ============================================================
   P3. COPY EMAIL
============================================================ */
const copyBtn = document.getElementById('copy-email-btn')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('arliturka@gmail.com').then(() => {
      copyBtn.textContent = '✓ Copied!'
      copyBtn.classList.add('copied')
      setTimeout(() => {
        copyBtn.textContent = 'Copy Email'
        copyBtn.classList.remove('copied')
      }, 2000)
    })
  })
}

/* ============================================================
   U1. KEYBOARD NAV
============================================================ */
document.addEventListener('keydown',   e => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav') })
document.addEventListener('mousedown', ()  => document.body.classList.remove('keyboard-nav'))

/* ============================================================
   MOBILE NAV responsive styles
============================================================ */
const style = document.createElement('style')
style.textContent = `
  @media (max-width: 900px) {
    #nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%; left: 0; right: 0;
      background: #080808;
      padding: 20px;
      border-top: 1px solid #1e1e1e;
      gap: 20px;
    }
    #nav-links.active { display: flex; }
    #hamburger { display: block; }
  }
`
document.head.appendChild(style)