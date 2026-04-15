import './style.css'
import { injectSpeedInsights } from '@vercel/speed-insights'

injectSpeedInsights()

const isTouchDevice = matchMedia('(hover: none)').matches

/* ============================================================
   CUSTOM CURSOR — pauses when mouse stops moving
============================================================ */
const dot  = document.getElementById('cursor-dot')
const ring = document.getElementById('cursor-ring')

if (isTouchDevice) {
  dot?.remove()
  ring?.remove()
  document.body.classList.add('no-custom-cursor')
} else {
  let mx = 0, my = 0, rx = 0, ry = 0, cursorVisible = false, cursorMoving = false

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY
    if (!cursorVisible) {
      cursorVisible = true
      dot.style.opacity = '1'
      ring.style.opacity = '0.5'
    }
    if (!cursorMoving) {
      cursorMoving = true
      tickCursor()
    }
  }, { passive: true })

  function tickCursor() {
    rx += (mx - rx) * 0.18
    ry += (my - ry) * 0.18
    dot.style.transform  = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`
    if (Math.abs(mx - rx) > 0.5 || Math.abs(my - ry) > 0.5) {
      requestAnimationFrame(tickCursor)
    } else {
      ring.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`
      cursorMoving = false
    }
  }

  document.addEventListener('mouseover', e => {
    const hovering = e.target.closest('a, button')
    ring.style.width   = hovering ? '44px' : '30px'
    ring.style.height  = hovering ? '44px' : '30px'
    ring.style.opacity = hovering ? '1' : '0.5'
  }, { passive: true })
}

/* ============================================================
   NAV SCROLL STATE
============================================================ */
const nav = document.getElementById('nav')
let lastScrolled = false
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 30
  if (scrolled !== lastScrolled) {
    lastScrolled = scrolled
    nav.classList.toggle('nav-scrolled', scrolled)
  }
}, { passive: true })

/* ============================================================
   HAMBURGER
============================================================ */
const hamburger = document.getElementById('hamburger')
const navLinks  = document.getElementById('nav-links')

hamburger.addEventListener('click', () => navLinks.classList.toggle('active'))
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') navLinks.classList.remove('active')
})

/* ============================================================
   SCROLL REVEAL — single shared observer
============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      entries[i].target.classList.add('visible')
      revealObserver.unobserve(entries[i].target)
    }
  }
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

/* ============================================================
   ACTIVE NAV LINK
============================================================ */
const navAnchors = document.querySelectorAll('.nav-link')
const sectionObserver = new IntersectionObserver(entries => {
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      const id = entries[i].target.id
      for (let j = 0; j < navAnchors.length; j++) {
        navAnchors[j].classList.toggle('nav-active', navAnchors[j].hash === '#' + id)
      }
    }
  }
}, { threshold: 0.35 })
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s))

/* ============================================================
   MINIMAL PARTICLE CANVAS — only in hero, 20fps, few particles
============================================================ */
const canvas = document.getElementById('particles')
const ctx = canvas.getContext('2d', { alpha: true })
let cW, cH

function resizeCanvas() {
  cW = canvas.width  = canvas.offsetWidth
  cH = canvas.height = canvas.offsetHeight
}
resizeCanvas()

const dpr = Math.min(devicePixelRatio, 1)
const PARTICLE_COUNT = Math.min(40, Math.round(innerWidth / 30))

const px = new Float32Array(PARTICLE_COUNT)
const py = new Float32Array(PARTICLE_COUNT)
const ps = new Float32Array(PARTICLE_COUNT)
const pvx = new Float32Array(PARTICLE_COUNT)
const pvy = new Float32Array(PARTICLE_COUNT)

for (let i = 0; i < PARTICLE_COUNT; i++) {
  px[i]  = Math.random() * cW
  py[i]  = Math.random() * cH
  ps[i]  = Math.random() * 1.8 + 0.4
  pvx[i] = Math.random() * 0.4 - 0.2
  pvy[i] = Math.random() * 0.3 + 0.05
}

let animPaused = false
let heroVisible = true

document.addEventListener('visibilitychange', () => { animPaused = document.hidden })

new IntersectionObserver(entries => {
  heroVisible = entries[0].isIntersecting
}, { threshold: 0 }).observe(document.getElementById('hero'))

let resizeTimer
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resizeCanvas, 200)
}, { passive: true })

const FRAME_MS = 1000 / 20
let lastFrame = 0

function loop(now) {
  if (!animPaused && heroVisible && now - lastFrame >= FRAME_MS) {
    lastFrame = now
    ctx.clearRect(0, 0, cW, cH)
    ctx.fillStyle = '#c8ff00'
    ctx.globalAlpha = 0.4
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      px[i] += pvx[i]; py[i] += pvy[i]
      if (px[i] < 0 || px[i] > cW) pvx[i] = -pvx[i]
      if (py[i] < 0 || py[i] > cH) pvy[i] = -pvy[i]
      ctx.fillRect(px[i], py[i], ps[i], ps[i])
    }
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

/* ============================================================
   SKILL BARS
============================================================ */
const skillsSection = document.getElementById('skills')
if (skillsSection) {
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      const bars = entries[0].target.querySelectorAll('.bar-fill')
      for (let i = 0; i < bars.length; i++) {
        const w = bars[i].dataset.width
        if (w) bars[i].style.width = w + '%'
      }
      obs.unobserve(entries[0].target)
    }
  }, { threshold: 0.3 }).observe(skillsSection)
}

/* ============================================================
   SPLASH — instant dismiss
============================================================ */
const splash = document.getElementById('splash')
if (splash) {
  requestAnimationFrame(() => {
    splash.classList.add('splash-out')
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  })
}

/* ============================================================
   TYPEWRITER — immediate start
============================================================ */
const subtitleEl = document.querySelector('.hero-subtitle')
if (subtitleEl) {
  const text = 'Systems programmer & full-stack builder.\nC \u00b7 Python \u00b7 Low-level systems \u00b7 ML tooling'
  subtitleEl.textContent = ''
  let i = 0
  function type() {
    if (i < text.length) {
      if (text[i] === '\n') {
        subtitleEl.appendChild(document.createElement('br'))
      } else {
        subtitleEl.appendChild(document.createTextNode(text[i]))
      }
      i++
      setTimeout(type, 20)
    }
  }
  setTimeout(type, 400)
}

/* ============================================================
   PROJECT CARD TILT — lightweight
============================================================ */
if (!isTouchDevice) {
  document.querySelectorAll('.project-card').forEach(card => {
    let raf = 0
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 8
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 8
        card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`
      })
    }, { passive: true })
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf)
      card.style.transform = ''
    })
  })
}

/* ============================================================
   LAZY-LOAD thumbnails
============================================================ */
const lazyObs = new IntersectionObserver((entries, obs) => {
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      const el = entries[i].target
      el.style.backgroundImage    = `url('${el.dataset.bg}')`
      el.style.backgroundSize     = 'cover'
      el.style.backgroundPosition = 'center'
      obs.unobserve(el)
    }
  }
}, { rootMargin: '200px' })
document.querySelectorAll('.lazy-bg').forEach(el => lazyObs.observe(el))

/* ============================================================
   GITHUB API — cached in sessionStorage (10-min TTL)
============================================================ */
const ICON = {
  star:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  fork:  '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 5C7 3.9 7.9 3 9 3s2 .9 2 2c0 .74-.4 1.39-1 1.73V14h3c.28-.96 1.15-1.63 2.19-1.63 1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25c-1.06 0-1.95-.72-2.19-1.69H8.88c-.42 0-.76-.34-.76-.75V6.73C7.52 6.39 7 5.74 7 5z"/></svg>',
  issue: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  clock: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
}
const LANG_COLORS = { JavaScript:'#f1e05a', Python:'#3572A5', C:'#555599', TypeScript:'#2b7489', HTML:'#e34c26', CSS:'#563d7c', Shell:'#89e051' }
const CACHE_TTL = 10 * 60 * 1000

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 60) return s + 's ago'
  if (s < 3600) return Math.floor(s/60) + 'm ago'
  if (s < 86400) return Math.floor(s/3600) + 'h ago'
  if (s < 2592000) return Math.floor(s/86400) + 'd ago'
  return Math.floor(s/2592000) + 'mo ago'
}

function cache(k, v) {
  if (v === undefined) {
    try { const r = JSON.parse(sessionStorage.getItem(k)); if (r && Date.now() - r.t < CACHE_TTL) return r.d } catch {}
    return null
  }
  try { sessionStorage.setItem(k, JSON.stringify({ d: v, t: Date.now() })) } catch {}
}

async function fetchRepo(slug, el) {
  try {
    let d = cache('gh_' + slug)
    if (!d) {
      const [r1, r2] = await Promise.all([
        fetch('https://api.github.com/repos/' + slug),
        fetch('https://api.github.com/repos/' + slug + '/commits?per_page=1')
      ])
      const repo = await r1.json(), commits = await r2.json()
      d = { s: repo.stargazers_count||0, f: repo.forks_count||0, i: repo.open_issues_count||0, l: repo.language||'', c: commits[0]?.commit?.author?.date }
      cache('gh_' + slug, d)
    }
    const lc = LANG_COLORS[d.l] || '#888'
    const le = el.querySelector('.repo-lang')
    if (le) le.innerHTML = `<span class="w-2 h-2 rounded-full inline-block" style="background:${lc}"></span>${d.l}`
    const m = { stars: ICON.star + ' ' + d.s, forks: ICON.fork + ' ' + d.f, issues: ICON.issue + ' ' + d.i + ' issues', commit: d.c ? ICON.clock + ' ' + timeAgo(d.c) : '' }
    for (const [k, v] of Object.entries(m)) {
      const s = el.querySelector('.repo-stat-' + k)
      if (s) { if (v) s.innerHTML = v; else s.remove() }
    }
  } catch {}
}

document.querySelectorAll('.repo-stats-card').forEach(el => {
  const s = el.dataset.repo
  if (s) fetchRepo(s, el)
})

/* ============================================================
   EMAILJS CONTACT FORM
============================================================ */
const contactForm = document.getElementById('contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault()
    const status = document.getElementById('form-status')
    const btn = contactForm.querySelector('.form-submit')
    status.textContent = 'Sending...'
    status.style.color = '#555'
    btn.disabled = true
    try {
      await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
      status.textContent = '\u2713 Message sent!'
      status.style.color = '#c8ff00'
      contactForm.reset()
    } catch {
      status.textContent = '\u2717 Failed \u2014 try emailing directly.'
      status.style.color = '#ff4444'
    } finally { btn.disabled = false }
  })
}

/* ============================================================
   COPY EMAIL
============================================================ */
const copyBtn = document.getElementById('copy-email-btn')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('arliturka@gmail.com').then(() => {
      copyBtn.textContent = '\u2713 Copied!'
      copyBtn.classList.add('copied')
      setTimeout(() => { copyBtn.textContent = 'Copy Email'; copyBtn.classList.remove('copied') }, 2000)
    })
  })
}

/* ============================================================
   KEYBOARD NAV
============================================================ */
document.addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav') })
document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'))
