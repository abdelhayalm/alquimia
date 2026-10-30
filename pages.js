'use strict';

// Progressive enhancement for the Method and About chapters.
document.body.classList.add('has-js');
const menuButton = document.querySelector('.menu-toggle');
const chapterNav = document.getElementById('main-navigation');
const compactNav = window.matchMedia('(max-width: 1100px)');

function closeChapterMenu() {
  chapterNav.hidden = compactNav.matches;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Open navigation';
}
if (menuButton && chapterNav) {
  closeChapterMenu();
  compactNav.addEventListener('change', closeChapterMenu);
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    chapterNav.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.querySelector('.sr-only').textContent = opening ? 'Close navigation' : 'Open navigation';
  });
  chapterNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeChapterMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeChapterMenu();
      menuButton.focus();
    }
  });
}

const sampleTabs = [...document.querySelectorAll('[data-sample]')];
const samplePanels = [...document.querySelectorAll('.sample-panel')];
function chooseSample(tab, focus = false) {
  sampleTabs.forEach(item => {
    const chosen = item === tab;
    item.setAttribute('aria-selected', String(chosen));
    item.tabIndex = chosen ? 0 : -1;
  });
  samplePanels.forEach(panel => {
    panel.hidden = panel.id !== 'sample-' + tab.dataset.sample;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'sample-tab-' + panel.id.replace('sample-', ''));
    panel.tabIndex = 0;
  });
  if (focus) tab.focus();
}
if (sampleTabs.length) {
  sampleTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseSample(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % sampleTabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + sampleTabs.length) % sampleTabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = sampleTabs.length - 1;
      if (next === undefined) return;
      e.preventDefault();
      chooseSample(sampleTabs[next], true);
    });
  });
  chooseSample(sampleTabs[0]);
  document.querySelector('.chapter-tabs').hidden = false;
}

const yearLabel = document.getElementById('copyright-year');
if (yearLabel) yearLabel.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionControl = document.querySelector('.chapter-motion');
let motionPaused = reducedMotion.matches;
function setChapterMotion() {
  const enabled = !motionPaused && !reducedMotion.matches;
  document.body.classList.toggle('chapter-motion-on', enabled);
  document.body.classList.toggle('chapter-motion-off', !enabled);
  if (motionControl) {
    motionControl.hidden = false;
    motionControl.disabled = reducedMotion.matches;
    motionControl.setAttribute('aria-pressed', String(!enabled));
    motionControl.textContent = reducedMotion.matches ? 'Reduced motion' : enabled ? 'Pause motion' : 'Resume motion';
  }
}
// Copy is visible until the observer is available; no animation dependency.
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('chapter-visible');
        reveal.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -16px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
  document.body.classList.add('chapters-enhanced');
} else {
  document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('chapter-visible'));
}
motionControl?.addEventListener('click', () => {
  motionPaused = !motionPaused;
  setChapterMotion();
});
reducedMotion.addEventListener('change', e => {
  motionPaused = e.matches;
  setChapterMotion();
});
setChapterMotion();
