import { COUNTRY_CODES, getOffer, formatAmount, createSignupId } from './payment-config.js';
const dialog=document.getElementById('join-dialog');
const form=document.getElementById('join-form');
const status=document.getElementById('checkout-status');
const submit=document.getElementById('checkout-submit');
const country=document.getElementById('member-country');
const name=document.getElementById('member-name');
const email=document.getElementById('member-email');
const plans=[...form.querySelectorAll('[name="membership"]')];
let opener,busy=false,attempt=null;
function selectedPlan(){return plans.find(p=>p.checked)?.value || 'monthly';}
function announce(text,error=false){status.textContent=text;status.classList.toggle('is-error',error);if(error)status.focus();}
function updatePlan(){
  const annual=selectedPlan()==='annual';
  document.getElementById('checkout-plan-name').textContent=annual?'Annual membership':'Monthly membership';
  document.getElementById('checkout-total').textContent=formatAmount(getOffer('USD',selectedPlan()).amount,'USD');
  document.getElementById('checkout-period').textContent=annual?'for 12 months':'per month';
  document.getElementById('checkout-saving').hidden=!annual;
}
function setBusy(value){
  busy=value;form.setAttribute('aria-busy',String(value));
  form.querySelectorAll('input,select,button').forEach(el=>el.disabled=value);
  dialog.querySelector('.dialog-close').disabled=value;
  submit.classList.toggle('is-loading',value);
  submit.querySelector('.submit-label').textContent=value?'Saving your details…':'Continue to Stripe';
}
let regions;
try{regions=new Intl.DisplayNames(['en'],{type:'region'});}catch{}
const countries=COUNTRY_CODES.map(code=>({code,label:regions?.of(code)||code})).sort((a,b)=>a.label.localeCompare(b.label,'en'));
country.append(...countries.map(item=>new Option(item.label,item.code)));
plans.forEach(input=>input.addEventListener('change',()=>{announce('');updatePlan();}));
form.addEventListener('input',event=>event.target.removeAttribute('aria-invalid'));
form.addEventListener('invalid',event=>event.target.setAttribute('aria-invalid','true'),true);
document.querySelectorAll('[data-membership]').forEach(link=>link.addEventListener('click',event=>{
  if(typeof dialog.showModal!=='function'||!getOffer('USD',link.dataset.membership))return;
  event.preventDefault();opener=link;
  plans.forEach(input=>input.checked=input.value===link.dataset.membership);
  announce('');updatePlan();dialog.showModal();dialog.scrollTop=0;document.body.classList.add('dialog-open');
  // Let the native dialog choose initial focus without forcing a mobile keyboard.
}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
dialog.addEventListener('click',event=>{
  if(event.target!==dialog||busy)return;
  const box=dialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus({preventScroll:true});});
form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  name.value=name.value.trim();email.value=email.value.trim();
  if(!form.reportValidity())return;
  const details={name:name.value,email:email.value,country:country.value,language:'English',membership:selectedPlan(),currency:'USD',website:form.elements.website.value};
  if(!COUNTRY_CODES.includes(details.country))return;
  const fingerprint=JSON.stringify(details);
  if(!attempt||attempt.fingerprint!==fingerprint)attempt={fingerprint,id:createSignupId()};
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),23000);
  setBusy(true);announce('Saving your details before secure payment…');
  try{
    const response=await fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({...details,signupId:attempt.id}),signal:controller.signal});
    const result=await response.json();
    if(!response.ok||result.saved!==true||result.signupId!==attempt.id){const error=new Error('Signup not saved');error.code=result.code;throw error;}
    const next=new URL(result.checkoutUrl);
    const expected=new URL(getOffer('USD',details.membership).url);
    if(next.origin!==expected.origin||next.pathname!==expected.pathname||next.username||next.password)throw new Error('Invalid checkout');
    announce('Details saved. Opening Stripe…');window.location.assign(next.href);
  }catch(error){
    const message=error.code==='not_configured'?'Online signup is temporarily unavailable. Please contact Hapi below to join.':error.code==='rate_limited'?'Please wait a few minutes and try again, or contact Hapi below.':error.code==='id_conflict'?'Please check your details and try again, or contact Hapi below.':'We couldn’t save your details. Please try again, or contact Hapi below. No payment has been taken by this form.';
    announce(message,true);
  }finally{clearTimeout(timeout);setBusy(false);}
});
window.addEventListener('pageshow',()=>{setBusy(false);announce('');});
updatePlan();
