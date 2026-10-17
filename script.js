'use strict';

// Member details stay in the page until the visitor opens a WhatsApp draft.
// Nothing is stored, submitted to a server, or automatically sent to Álquimia.
const WHATSAPP_NUMBER = '5561999598410';
const plans = Object.freeze({
  monthly: Object.freeze({ message: 'Monthly membership — US$25 for one month' }),
  annual: Object.freeze({ message: 'Annual membership — US$250 for twelve months' }),
});
const isValidPlan = key => Object.prototype.hasOwnProperty.call(plans, key);
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
const form = document.getElementById('join-form');
const nameField = document.getElementById('member-name');
const emailField = document.getElementById('member-email');
const preview = document.getElementById('message-preview-text');
const planSupport = document.getElementById('plan-support-note');
let openingLink = null;

function cleanLine(value) {
  return String(value ?? '').trim().replace(/[\r\n]+/g, ' ');
}
function buildMembershipMessage({ membership, name, email, language }) {
  if (!isValidPlan(membership)) throw new Error('Unknown membership choice');
  if (!['English', 'Português'].includes(language)) throw new Error('Unknown session language');
  const isPortuguese = language === 'Português';
  const lines = isPortuguese ? [
    'Olá, equipe da Álquimia! Quero fazer parte da comunidade.',
    '',
    'Plano: ' + (membership === 'annual' ? 'Anual — US$250 por doze meses' : 'Mensal — US$25 por um mês'),
    'Nome: ' + cleanLine(name),
    'Email para o convite na NAS.com e atualizações da comunidade: ' + cleanLine(email),
    'Sessão semanal preferida: Português',
    '',
    'Quero organizar o pagamento diretamente com a equipe da Álquimia. Entendo que a Álquimia adiciona meu acesso à comunidade na NAS.com manualmente após o pagamento ser confirmado.',
  ] : [
    'Hello, Álquimia team! I would like to join the community.',
    '',
    'Membership: ' + plans[membership].message,
    'Name: ' + cleanLine(name),
    'Email for my NAS.com invitation and community updates: ' + cleanLine(email),
    'Preferred weekly session: English',
    '',
    'Please help me arrange payment directly with the Álquimia team. I understand that Álquimia adds my NAS.com community access manually after payment is confirmed.',
  ];
  return lines.join('\n');
}
function readMemberDetails() {
  return Object.fromEntries(new FormData(form).entries());
}
function updateMessagePreview() {
  const data = readMemberDetails();
  if (!isValidPlan(data.membership)) return;
  const portuguese = data.language === 'Português';
  if (planSupport) planSupport.hidden = data.membership !== 'annual';
  data.name = cleanLine(data.name) || (portuguese ? 'Seu nome' : 'Your name');
  data.email = cleanLine(data.email) || (portuguese ? 'Seu email' : 'Your email');
  // Use textContent so names, email addresses, and message text are never HTML.
  preview.textContent = buildMembershipMessage(data);
  preview.lang = portuguese ? 'pt-BR' : 'en';
}

document.querySelectorAll('[data-membership]').forEach(link => {
  link.addEventListener('click', event => {
    // The genuine WhatsApp href works without JavaScript or native dialog support.
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const planKey = link.dataset.membership;
    if (!isValidPlan(planKey)) return;
    event.preventDefault();
    openingLink = link;
    form.querySelectorAll('input[name="membership"]').forEach(radio => {
      radio.checked = radio.value === planKey;
    });
    updateMessagePreview();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    refreshMobileJoin();
    nameField.focus();
  });
});

function closeDialog() {
  if (dialog.open) dialog.close();
}
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  refreshMobileJoin();
  if (openingLink) openingLink.focus();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
});
nameField.addEventListener('input', () => nameField.setCustomValidity(''));
emailField.addEventListener('input', () => emailField.setCustomValidity(''));
form.addEventListener('input', updateMessagePreview);
form.addEventListener('change', updateMessagePreview);
form.addEventListener('submit', event => {
  event.preventDefault();
  nameField.setCustomValidity('');
  emailField.setCustomValidity('');
  nameField.value = nameField.value.trim();
  emailField.value = emailField.value.trim();
  if (!nameField.value) nameField.setCustomValidity('Please enter your name.');
  if (!form.reportValidity()) return;
  const data = readMemberDetails();
  if (!isValidPlan(data.membership) || !['English', 'Português'].includes(data.language)) return;
  const message = buildMembershipMessage(data);
  // The draft opens in the same tab. The visitor sends it in WhatsApp.
  // Payment and manual onboarding remain outside the website.
  window.location.assign('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message));
});
updateMessagePreview();

// A mobile shortcut appears between the hero and membership section.
// It stays hidden when the dialog, pricing section, or footer is visible.
const mobileJoin = document.querySelector('.mobile-join');
const mobileQuery = window.matchMedia('(max-width: 640px)');
const visibleSections = new Set(['home']);
function refreshMobileJoin() {
  if (!mobileJoin) return;
  mobileJoin.hidden = !mobileQuery.matches || dialog.open || visibleSections.size > 0;
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
document.getElementById('copyright-year').textContent = new Date().getFullYear();

// Version 4 motion is decorative and never takes control of wheel or touch scrolling.
// Reduced motion and the visible pause button leave every chapter readable.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sceneQuery = window.matchMedia('(min-width: 1000px) and (min-height: 740px)');
  const experience = document.getElementById('experience');
  const stage = experience?.querySelector('.experience-stage');
  const cards = [...document.querySelectorAll('.experience-card')];
  const orbit = document.querySelector('.learning-orbit');
  const motionButton = document.querySelector('.motion-toggle');
  let paused = reducedMotion.matches;
  let pinned = false;
  let sceneNear = true;
  let frame = 0;
  let revealObserver;
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => 1 - Math.pow(1 - value, 3);

  function renderScene() {
    frame = 0;
    if (!pinned || !sceneNear || !stage) return;
    const bounds = experience.getBoundingClientRect();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 84;
    const distance = Math.max(1, experience.offsetHeight - stage.offsetHeight);
    const progress = clamp((headerHeight - bounds.top) / distance);
    const opening = ease(clamp(progress / .72));
    experience.style.setProperty('--experience-progress', progress.toFixed(4));
    experience.style.setProperty('--stage-inset', (54 * (1 - opening)).toFixed(2) + 'px');
    experience.style.setProperty('--stage-radius', (130 * (1 - opening)).toFixed(2) + 'px');
    cards.forEach((card, index) => {
      const step = ease(clamp((progress - index * .22) / .26));
      card.style.setProperty('--card-opacity', String(clamp(step * 1.4)));
      card.style.setProperty('--card-rise', (130 * (1 - step)).toFixed(2) + 'px');
      card.style.setProperty('--card-tilt', ((index === 1 ? 7 : -7) * (1 - step)).toFixed(2) + 'deg');
    });
  }
  function requestScene() {
    if (!pinned || !sceneNear || frame) return;
    frame = window.requestAnimationFrame(renderScene);
  }
  function configureMotion() {
    document.body.classList.toggle('motion-paused', paused);
    document.body.classList.toggle('motion-enabled', !paused);
    if (motionButton) {
      motionButton.hidden = false;
      motionButton.disabled = reducedMotion.matches;
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.querySelector('span').textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
      motionButton.querySelector('use').setAttribute('href', paused ? '#icon-play' : '#icon-pause');
    }
    pinned = Boolean(experience && stage && sceneQuery.matches && !paused);
    experience?.classList.toggle('scroll-scene', pinned);
    cards.forEach(card => {
      // Cards are revealed in reading order on smaller screens and short desktop windows.
      if (pinned || paused || !revealObserver) {
        revealObserver?.unobserve(card);
        card.classList.remove('reveal-ready');
        card.classList.add('is-visible');
      } else {
        card.classList.add('reveal-ready');
        revealObserver.observe(card);
      }
    });
    if (paused && orbit) orbit.classList.add('orbit-awake');
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (pinned) renderScene();
  }

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.why-heading, .egypt-copy, .benefits-grid article, .founder-proof, .annual-support, .closing-content')
      .forEach(element => {
        element.classList.add('reveal-ready');
        revealObserver.observe(element);
      });
    if (orbit) {
      const orbitObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          orbit.classList.add('orbit-awake');
          orbitObserver.disconnect();
        }
      }, { threshold: .15 });
      orbitObserver.observe(orbit);
    }
    if (experience) {
      const sceneObserver = new IntersectionObserver(entries => {
        sceneNear = entries.some(entry => entry.isIntersecting);
        if (sceneNear) requestScene();
      }, { rootMargin: '150px' });
      sceneObserver.observe(experience);
    }
  }
  motionButton?.addEventListener('click', () => {
    paused = !paused;
    configureMotion();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    configureMotion();
  });
  sceneQuery.addEventListener('change', configureMotion);
  window.addEventListener('scroll', requestScene, { passive: true });
  window.addEventListener('resize', requestScene, { passive: true });
  window.addEventListener('load', requestScene, { once: true });
  configureMotion();
})();
