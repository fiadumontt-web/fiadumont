import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './fonts.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { detectCapability } from './capability.js';

gsap.registerPlugin(ScrollTrigger);

const capability = detectCapability();
document.documentElement.dataset.hero = capability.full ? 'webgl' : 'static';

// Language System (igual ao original)
function initLanguage() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
}

function setLanguage(lang) {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const on = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('[data-pt][data-en]').forEach((el) => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en-US';
  ScrollTrigger.refresh();
}

// Scroll suave
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;
if (!reduceMotion) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Navegação: a página é contínua, o menu faz scroll até cada secção
function navigateToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const offset = sectionId === 'home' ? 0 : -document.querySelector('.nav').offsetHeight * 0.5;
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 });
  else window.scrollTo({ top: target.offsetTop + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
}
window.navigateToSection = navigateToSection; // usado pelo botão do hero

function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  // Menu, logótipo e links do rodapé
  document.querySelectorAll('[data-section]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSection(el.getAttribute('data-section'));
    });
  });

  const setActive = (id) =>
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('data-section') === id));

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: '-45% 0px -45% 0px' }
  );
  document.querySelectorAll('.section').forEach((s) => observer.observe(s));
}

// Transição hero → conteúdo
function initHeroTransition() {
  if (reduceMotion) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom 20%', scrub: 0.6 },
  });
  tl.to('.hero-content', { yPercent: -35, opacity: 0, scale: 0.96, ease: 'none' }, 0)
    .to('#webgl-container', { opacity: 0, ease: 'power1.in' }, 0.15);
}

async function initHero3D() {
  if (!capability.full) return;
  const container = document.getElementById('webgl-container');
  try {
    const { mountHero } = await import('./hero/mount.jsx');
    mountHero(container, capability.tier);
  } catch (err) {
    console.warn('[hero] WebGL indisponível, a usar fundo estático', err);
    document.documentElement.dataset.hero = 'static';
  }
}

// O portfolio 3D só é carregado quando a secção se aproxima do ecrã
function initPortfolioLazy() {
  if (!capability.webgl || ['save-data', 'reduced-motion'].includes(capability.reason)) return;
  const section = document.getElementById('portfolio');
  const io = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const { initPortfolio3D } = await import('./portfolio3d.js');
      initPortfolio3D();
    },
    { rootMargin: '400px 0px' }
  );
  io.observe(section);
}

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  initLanguage();
  initNavigation();
  initHeroTransition();
  initHero3D();
  initPortfolioLazy();
});
