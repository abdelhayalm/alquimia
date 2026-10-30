import { COUNTRY_CODES, LANGUAGES, getOffer, checkoutURL } from '../payment-config.js';

const MAX_BYTES = 4096;
const validScriptURL = value => typeof value === 'string' && /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value);
const text = (value, max) => typeof value === 'string' && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value) ? value.trim() : '';
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  } });
}
function configured(env) {
  return validScriptURL(env.GOOGLE_SIGNUP_URL) && typeof env.SIGNUP_SHARED_SECRET === 'string' && env.SIGNUP_SHARED_SECRET.length >= 32;
}
async function sign(value, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
  return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function handleSignup(request, env, send = fetch) {
  if (request.method === 'GET') return json({ ready: configured(env) });
  if (request.method !== 'POST') return new Response(null, {status:405,headers:{Allow:'GET, POST','Cache-Control':'no-store'}});
  const origin = new URL(request.url).origin;
  if (request.headers.get('Origin') !== origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({code:'forbidden'},403);
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({code:'invalid_content_type'},415);
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return json({code:'too_large'},413);
  if (!configured(env)) return json({code:'not_configured'},503);
  let body;
  try {
    const reader = request.body.getReader();
    let length = 0;
    const chunks = [];
    while (true) {
      const {value,done} = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); return json({code:'too_large'},413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    chunks.forEach(chunk => { bytes.set(chunk,offset); offset += chunk.byteLength; });
    body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
  } catch { return json({code:'invalid_request'},400); }
  if (body.website !== '' && body.website !== undefined) return json({code:'invalid_request'},400);
  const name = text(body.name,100);
  const email = text(body.email,254);
  const offer = getOffer(body.currency,body.membership);
  if (!uuid(body.signupId) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !COUNTRY_CODES.includes(body.country) || !LANGUAGES.includes(body.language) || !offer) return json({code:'invalid_details'},400);
  // Derive all payment fields on the server. The browser cannot choose amount/status/URL.
  const record = {
    signupId:body.signupId, createdAt:new Date().toISOString(), name, email, country:body.country,
    language:body.language, membership:body.membership, currency:body.currency,
    amount:offer.amount, provider:offer.provider,
  };
  const payload = JSON.stringify({record, sentAt:Date.now(), rateKey:await sign('rate:' + (request.headers.get('CF-Connecting-IP') || 'unknown'),env.SIGNUP_SHARED_SECRET)});
  const signature = await sign(payload,env.SIGNUP_SHARED_SECRET);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),18000);
  try {
    const response = await send(env.GOOGLE_SIGNUP_URL, {
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload,signature}),
      redirect:'follow',signal:controller.signal,
    });
    if (!response.ok) return json({code:'save_failed'},502);
    const result = await response.json();
    if (result.code === 'rate_limited') return json({code:'rate_limited'},429);
    if (result.code === 'id_conflict') return json({code:'id_conflict'},409);
    if (result.saved !== true || result.signupId !== record.signupId) return json({code:'save_failed'},502);
    return json({ saved:true, signupId:record.signupId, checkoutUrl:checkoutURL(record.currency,record.membership,record.signupId,record.email,record.language) });
  } catch {
    // Never log the payload, email, name, shared secret, or upstream response.
    return json({code:'save_failed'},502);
  } finally { clearTimeout(timer); }
}
