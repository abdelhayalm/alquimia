import { CHECKOUTS, COUNTRY_CODES, LANGUAGES, getOffer, formatAmount, createSignupId } from './payment-config.js';

const dialog = document.getElementById('join-dialog');
const form = document.getElementById('join-form');
const status = document.getElementById('checkout-status');
const submit = document.getElementById('checkout-submit');
const language = document.getElementById('session-language');
const country = document.getElementById('member-country');
const membershipInputs = [...form.querySelectorAll('[name="membership"]')];
const currencyInputs = [...document.querySelectorAll('[data-currency-choice]')];
let currency = 'USD';
let opener;
let busy = false;
let attempt = null;

const copy = {
  en: {
    eyebrow: 'YOUR NEXT CHAPTER', title: 'Make it yours.', intro: 'A few details, then secure payment. Your place in the community starts here.',
    details: 'Your details', detailsNote: 'Use the email where you’d like to receive your community invitation.',
    name: 'Full name', email: 'Email address', country: 'Country', countryPlaceholder: 'Select your country', language: 'Weekly session language',
    session: 'Separate English and Portuguese sessions. Both are included.', plan: 'Your membership', currency: 'Pay in', monthly: 'Monthly', annual: 'Annual',
    monthlyPeriod: '/ month', annualPeriod: '/ 12 months', included: 'Everything included',
    benefit1: 'Weekly live sessions & recordings', benefit2: 'Lessons, creative missions & challenges', benefit3: 'Private NAS.com & WhatsApp community',
    annualSupport: 'A year for your learning. A stronger future for our school and community.', monthlySupport: 'Make room for curiosity, conversation, and a community to grow with.',
    payment: 'Secure payment', afterTitle: 'NAS.com & community access', secure: 'Secure payment with', cta: 'Continue to secure payment',
    redirect: 'Next, you’ll open {provider} in this tab to complete payment.',
    privacy: 'We save your details privately to prepare your community access. Your payment details are handled by the payment provider.',
    access: 'After payment is confirmed, the Álquimia team emails your NAS.com invitation and shares the WhatsApp group and weekly meeting details.',
    help: 'Need a hand? Talk with Álquimia', saving: 'Save {saving} compared with 12 monthly payments.',
    savingShort: 'Save {saving}', close: 'Close membership form',
    savingDetails: 'Saving your details…', opening: 'Details saved. Opening {provider}…',
    error: 'We couldn’t save your details. Please try again, or contact the Álquimia team below.',
    unavailable: 'Online signup is being connected. Please contact Álquimia below to join.',
    rate: 'Please wait a few minutes before trying again, or contact the team below.',
    invalid: 'Please check the highlighted fields.',
  },
  pt: {
    eyebrow: 'SEU PRÓXIMO CAPÍTULO', title: 'Sua jornada começa aqui.', intro: 'Seus dados, depois o pagamento seguro. Venha fazer parte da comunidade.',
    details: 'Seus dados', detailsNote: 'Use o email em que deseja receber seu convite para a comunidade.',
    name: 'Nome completo', email: 'Email', country: 'País', countryPlaceholder: 'Selecione seu país', language: 'Idioma dos encontros semanais',
    session: 'Encontros separados em inglês e português. Ambos estão incluídos.', plan: 'Seu plano', currency: 'Pagar em', monthly: 'Mensal', annual: 'Anual',
    monthlyPeriod: '/ mês', annualPeriod: '/ 12 meses', included: 'Tudo incluído',
    benefit1: 'Encontros semanais ao vivo e gravações', benefit2: 'Aulas, missões criativas e desafios', benefit3: 'Comunidade privada na NAS.com e no WhatsApp',
    annualSupport: 'Um ano para aprender. Um futuro mais forte para nossa escola e comunidade.', monthlySupport: 'Abra espaço para a curiosidade, a conversa e uma comunidade para crescer junto.',
    payment: 'Pagamento seguro', afterTitle: 'NAS.com e acesso à comunidade', secure: 'Pagamento seguro com', cta: 'Continuar para o pagamento',
    redirect: 'A seguir, você abrirá {provider} nesta aba para concluir o pagamento.',
    privacy: 'Salvamos seus dados de forma privada para preparar seu acesso à comunidade. Os dados de pagamento são tratados pela plataforma de pagamento.',
    access: 'Após a confirmação do pagamento, a equipe da Álquimia envia seu convite para a NAS.com por email e compartilha o grupo de WhatsApp e os encontros semanais.',
    help: 'Precisa de ajuda? Fale com a Álquimia', saving: 'Economize {saving} em relação a 12 pagamentos mensais.',
    savingShort: 'Economize {saving}', close: 'Fechar formulário',
    savingDetails: 'Salvando seus dados…', opening: 'Dados salvos. Abrindo {provider}…',
    error: 'Não foi possível salvar seus dados. Tente novamente ou fale com a equipe da Álquimia abaixo.',
    unavailable: 'Estamos conectando as inscrições online. Fale com a Álquimia abaixo para participar.',
    rate: 'Aguarde alguns minutos antes de tentar novamente ou fale com a equipe abaixo.',
    invalid: 'Confira os campos destacados.',
  },
};

function selectedPlan() { return membershipInputs.find(input => input.checked)?.value || 'monthly'; }
function portuguese() { return language.value === 'Português'; }
function dictionary() { return portuguese() ? copy.pt : copy.en; }
function announce(message, error = false) {
  status.textContent = message;
  status.classList.toggle('is-error', error);
  if (error) status.focus();
}
function fillCountries() {
  const selected = country.value;
  const display = new Intl.DisplayNames([portuguese() ? 'pt-BR' : 'en'], { type: 'region' });
  const entries = COUNTRY_CODES.map(code => ({code, name: display.of(code)})).sort((a, b) => a.name.localeCompare(b.name, portuguese() ? 'pt-BR' : 'en'));
  country.replaceChildren(new Option(dictionary().countryPlaceholder, ''), ...entries.map(item => new Option(item.name, item.code)));
  country.value = selected;
}
function updateUI() {
  const pt = portuguese();
  const text = dictionary();
  const plan = selectedPlan();
  const offer = getOffer(currency, plan);
  const savings = CHECKOUTS[currency].monthly.amount * 12 - CHECKOUTS[currency].annual.amount;
  const saveText = formatAmount(savings, currency, pt);
  dialog.lang = pt ? 'pt-BR' : 'en';
  dialog.querySelectorAll('[data-copy]').forEach(element => { element.textContent = text[element.dataset.copy]; });
  dialog.querySelector('.dialog-close').setAttribute('aria-label', text.close);
  currencyInputs.forEach(input => { input.checked = input.value === currency; });
  document.querySelectorAll('[data-card-amount]').forEach(element => {
    element.textContent = new Intl.NumberFormat('en-US').format(CHECKOUTS[currency][element.dataset.cardAmount].amount);
  });
  document.querySelectorAll('[data-currency-symbol]').forEach(element => { element.textContent = currency === 'USD' ? 'US$' : 'R$'; });
  document.querySelectorAll('[data-provider]').forEach(element => { element.textContent = offer.provider; });
  document.querySelector('[data-annual-badge]').textContent = currency === 'USD' ? '12 MONTHS FOR THE PRICE OF 10' : 'SAVE R$275 WITH ANNUAL';
  document.querySelector('[data-annual-saving]').textContent = 'Save ' + formatAmount(savings, currency) + ' versus 12 monthly payments';
  document.querySelector('[data-annual-support]').textContent = '12 months. ' + formatAmount(CHECKOUTS[currency].annual.amount, currency) + '. Help the school and community grow.';
  document.querySelector('[data-mobile-price]').textContent = formatAmount(CHECKOUTS[currency].monthly.amount, currency) + '/month · ' + formatAmount(CHECKOUTS[currency].annual.amount, currency) + '/year';
  membershipInputs.forEach(input => {
    const key = input.value;
    const label = input.closest('label');
    label.querySelector('[data-choice-price]').textContent = formatAmount(CHECKOUTS[currency][key].amount, currency, pt) + ' ' + (key === 'annual' ? text.annualPeriod : text.monthlyPeriod);
  });
  document.getElementById('checkout-plan-name').textContent = text[plan];
  document.getElementById('checkout-total').textContent = formatAmount(offer.amount, currency, pt);
  document.getElementById('checkout-period').textContent = plan === 'annual' ? text.annualPeriod : text.monthlyPeriod;
  document.getElementById('checkout-saving').textContent = plan === 'annual' ? text.saving.replace('{saving}', saveText) : '';
  document.getElementById('checkout-choice-saving').textContent = text.savingShort.replace('{saving}', saveText);
  document.getElementById('checkout-support').textContent = plan === 'annual' ? text.annualSupport : text.monthlySupport;
  document.getElementById('checkout-redirect').textContent = text.redirect.replace('{provider}', offer.provider);
  fillCountries();
}
function setBusy(value) {
  busy = value;
  form.setAttribute('aria-busy', String(value));
  // Leave the member's text visible. Prevent duplicate submission while saving.
  form.querySelectorAll('input, select, button').forEach(element => { element.disabled = value; });
  dialog.querySelector('.dialog-close').disabled = value;
  currencyInputs.forEach(element => { element.disabled = value; });
  submit.classList.toggle('is-loading', value);
}

currencyInputs.forEach(input => input.addEventListener('change', () => {
  currency = input.value;
  announce('');
  updateUI();
}));
membershipInputs.forEach(input => input.addEventListener('change', () => { announce(''); updateUI(); }));
language.addEventListener('change', () => { announce(''); updateUI(); });
form.addEventListener('input', event => {
  if (event.target.matches('input[type="text"], input[type="email"], select')) event.target.removeAttribute('aria-invalid');
});
form.addEventListener('invalid', event => { event.target.setAttribute('aria-invalid', 'true'); }, true);

document.querySelectorAll('[data-membership]').forEach(link => link.addEventListener('click', event => {
  if (typeof dialog.showModal !== 'function' || !getOffer(currency, link.dataset.membership)) return;
  event.preventDefault();
  opener = link;
  membershipInputs.forEach(input => { input.checked = input.value === link.dataset.membership; });
  announce('');
  updateUI();
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
  document.dispatchEvent(new Event('membership-dialog-change'));
  document.getElementById('member-name').focus({ preventScroll: true });
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog || busy) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  document.dispatchEvent(new Event('membership-dialog-change'));
  opener?.focus({ preventScroll: true });
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const text = dictionary();
  const name = document.getElementById('member-name');
  const email = document.getElementById('member-email');
  name.value = name.value.trim();
  email.value = email.value.trim();
  if (!form.reportValidity()) return;
  const details = { name: name.value, email: email.value, country: country.value, language: language.value, membership: selectedPlan(), currency, website: form.elements.website.value };
  if (!LANGUAGES.includes(details.language) || !COUNTRY_CODES.includes(details.country)) return;
  const fingerprint = JSON.stringify(details);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 23000);
  setBusy(true);
  announce(text.savingDetails);
  try {
    if (!attempt || attempt.fingerprint !== fingerprint) attempt = { fingerprint, id: createSignupId() };
    const response = await fetch('/api/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ ...details, signupId: attempt.id }), signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || result.saved !== true || result.signupId !== attempt.id) {
      const error = new Error('Signup not saved');
      error.code = result.code;
      throw error;
    }
    // Only hand off to one of the four approved hosted checkouts.
    const next = new URL(result.checkoutUrl);
    const expected = new URL(getOffer(details.currency, details.membership).url);
    if (next.origin !== expected.origin || next.pathname !== expected.pathname || next.username || next.password) throw new Error('Invalid checkout');
    announce(text.opening.replace('{provider}', getOffer(details.currency, details.membership).provider));
    window.location.assign(next.href);
  } catch (error) {
    const message = error.code === 'not_configured' ? text.unavailable : error.code === 'rate_limited' ? text.rate : text.error;
    announce(message, true);
  } finally {
    clearTimeout(timeout);
    setBusy(false);
  }
});

window.addEventListener('pageshow', () => { setBusy(false); announce(''); });
document.body.classList.add('payment-enhanced');
document.querySelectorAll('[data-currency-picker]').forEach(element => { element.hidden = false; });
updateUI();
