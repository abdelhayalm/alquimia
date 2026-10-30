// Public offer configuration. No credentials or customer records belong here.
export const CHECKOUTS = Object.freeze({
  USD: Object.freeze({
    provider: 'Stripe',
    monthly: Object.freeze({ amount: 25, url: 'https://buy.stripe.com/9B614n4Y0epPbY25NW4AU01' }),
    annual: Object.freeze({ amount: 250, url: 'https://buy.stripe.com/4gM6oHbmochH7HM4JS4AU02' }),
  }),
  BRL: Object.freeze({
    provider: 'InfinitePay',
    monthly: Object.freeze({ amount: 135, url: 'https://invoice.infinitepay.io/plans/kemet-alquimia/emmqvZmpmn' }),
    annual: Object.freeze({ amount: 1345, url: 'https://invoice.infinitepay.io/plans/kemet-alquimia/5zJENYOzrn' }),
  }),
});

export const COUNTRY_CODES = Object.freeze(('AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW').split(' '));
export const LANGUAGES = Object.freeze(['English', 'Português']);
export const REGISTER_HEADERS = Object.freeze(['Signup ID', 'Signup date (UTC)', 'Name', 'Email', 'Country', 'Session language', 'Membership', 'Currency', 'Amount', 'Payment provider', 'Payment status', 'Payment reference', 'NAS.com access', 'Access date (UTC)', 'Notes']);

export function createSignupId(random = globalThis.crypto) {
  if (typeof random?.randomUUID === 'function') return random.randomUUID();
  // getRandomValues also supports browsers predating randomUUID and local HTTP previews.
  const bytes = random.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
}

export function getOffer(currency, membership) {
  if (typeof currency !== 'string' || !Object.hasOwn(CHECKOUTS, currency) || !['monthly', 'annual'].includes(membership)) return null;
  return { ...CHECKOUTS[currency][membership], provider: CHECKOUTS[currency].provider };
}

export function formatAmount(amount, currency, portuguese = false) {
  const digits = new Intl.NumberFormat(portuguese ? 'pt-BR' : 'en-US', { maximumFractionDigits: 0 }).format(amount);
  return (currency === 'BRL' ? 'R$' : 'US$') + digits;
}

export function checkoutURL(currency, membership, signupId, email, language) {
  const offer = getOffer(currency, membership);
  if (!offer) throw new Error('Unknown offer');
  const url = new URL(offer.url);
  if (currency === 'USD') {
    url.searchParams.set('client_reference_id', signupId);
    url.searchParams.set('prefilled_email', email);
    url.searchParams.set('locale', language === 'Português' ? 'pt-BR' : 'en');
  }
  // InfinitePay plan links have no documented equivalent prefill/reference parameters.
  return url.href;
}
