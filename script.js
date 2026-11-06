'use strict';

document.body.classList.add('has-js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-navigation');
const navigationQuery = window.matchMedia('(max-width: 1100px)');

function closeMenu() {
  navigation.hidden = navigationQuery.matches;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
}
closeMenu();
navigationQuery.addEventListener('change', closeMenu);
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.querySelector('.sr-only').textContent = opening ? 'Close navigation' : 'Open navigation';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuToggle.focus();
  }
});

// The examples remain readable as ordinary articles if JavaScript is unavailable.
const missionTabs = [...document.querySelectorAll('[data-mission]')];
const missionPanels = [...document.querySelectorAll('.mission-panel')];
function selectMission(tab, focus = false) {
  missionTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  missionPanels.forEach(panel => {
    panel.hidden = panel.id !== 'mission-' + tab.dataset.mission;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'tab-' + panel.id.replace('mission-', ''));
    panel.tabIndex = 0;
  });
  if (focus) tab.focus();
}
missionTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectMission(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % missionTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + missionTabs.length) % missionTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = missionTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectMission(missionTabs[next], true);
  });
});
if (missionTabs.length) {
  document.querySelector('.mission-tabs').hidden = false;
  selectMission(missionTabs[0]);
}

const dialog = document.getElementById('join-dialog');

// A mobile shortcut appears between the hero and membership section.
// It stays hidden when the dialog, pricing section, or footer is visible.
const mobileJoin = document.querySelector('.mobile-join');
const mobileQuery = window.matchMedia('(max-width: 640px)');
const visibleSections = new Set(['home']);
function refreshMobileJoin() {
  if (!mobileJoin) return;
  mobileJoin.hidden = !mobileQuery.matches || dialog.open || visibleSections.size > 0;
  document.body.classList.toggle('has-mobile-join', !mobileJoin.hidden);
}
if ('IntersectionObserver' in window) {
  const joinObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const key = entry.target.id || 'footer';
      if (entry.isIntersecting) visibleSections.add(key);
      else visibleSections.delete(key);
    });
    refreshMobileJoin();
  });
  [document.getElementById('home'), document.getElementById('membership'), document.getElementById('join-community'), document.querySelector('.site-footer')]
    .forEach(section => joinObserver.observe(section));
  mobileQuery.addEventListener('change', refreshMobileJoin);
}
document.addEventListener('membership-dialog-change', refreshMobileJoin);
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Short, once-only entrances. Content never depends on a CSS hidden state.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealAnimations = new Set();
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      if (reducedMotion.matches || !entry.target.animate) return;
      const animation = entry.target.animate(
        [{ opacity: .72, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
      revealAnimations.add(animation);
      animation.finished.then(() => revealAnimations.delete(animation)).catch(() => {});
    });
  }, { threshold: .1 });
  document.querySelectorAll('.why-heading, .experience-cards, .egypt-copy, .founder-introduction, .center-heading')
    .forEach(element => revealObserver.observe(element));
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) revealAnimations.forEach(animation => animation.cancel());
});
