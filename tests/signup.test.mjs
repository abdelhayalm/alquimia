import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHmac} from 'node:crypto';
import vm from 'node:vm';
import {handleSignup} from '../integrations/signup-handler.js';
import {CHECKOUTS,COUNTRY_CODES,REGISTER_HEADERS,createSignupId} from '../payment-config.js';

const secret='test-only-secret-not-for-production-12345678';
const env={GOOGLE_SIGNUP_URL:'https://script.google.com/macros/s/test-deployment/exec',SIGNUP_SHARED_SECRET:secret};
const signupId='a2234567-1234-4567-9234-123456789012';
const details={signupId,name:'Test Learner',email:'learner@example.com',country:'BR',language:'Português',currency:'USD',membership:'monthly',website:''};
const request=(body=details,headers={})=>new Request('https://alquimia.example/api/signup',{method:'POST',headers:{Origin:'https://alquimia.example','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.1',...headers},body:JSON.stringify(body)});
const saved=async(_url,options)=>{
  const envelope=JSON.parse(options.body);
  assert.equal(envelope.signature,createHmac('sha256',secret).update(envelope.payload).digest('hex'));
  const {record}=JSON.parse(envelope.payload);
  return Response.json({saved:true,signupId:record.signupId});
};

test('four routes only redirect after a signed record is acknowledged',async()=>{
  for(const currency of ['USD','BRL']) for(const membership of ['monthly','annual']) {
    let calls=0;
    const response=await handleSignup(request({...details,currency,membership,amount:0,paymentStatus:'Paid',checkoutUrl:'https://evil.example'}),env,async(url,options)=>{
      calls++;
      const {record,rateKey}=JSON.parse(JSON.parse(options.body).payload);
      assert.equal(record.amount,CHECKOUTS[currency][membership].amount);
      assert.equal(record.provider,CHECKOUTS[currency].provider);
      assert.equal(record.paymentStatus,undefined);
      assert.equal(record.checkoutUrl,undefined);
      assert.match(rateKey,/^[a-f0-9]{64}$/);
      assert.equal(options.body.includes('192.0.2.1'),false);
      return saved(url,options);
    });
    assert.equal(response.status,200);
    const result=await response.json();
    const url=new URL(result.checkoutUrl);
    assert.equal(url.origin+url.pathname,CHECKOUTS[currency][membership].url);
    assert.equal(result.saved,true);
    assert.equal(calls,1);
    if(currency==='USD') { assert.equal(url.searchParams.get('client_reference_id'),signupId); assert.equal(url.searchParams.get('prefilled_email'),details.email); }
    else assert.equal(url.search,'');
    assert.equal(response.headers.get('Cache-Control'),'no-store');
  }
});
test('no redirect on unavailable setup, failure, wrong acknowledgement, or rate limit',async()=>{
  for(const [configuration,send,status] of [
    [{},saved,503],
    [env,async()=>{throw new Error('Offline');},502],
    [env,async()=>Response.json({saved:false}),502],
    [env,async()=>Response.json({saved:true,signupId:'wrong-id'}),502],
    [env,async()=>Response.json({code:'rate_limited'}),429],
    [env,async()=>new Response('Google sign-in',{status:200}),502],
  ]) {
    const response=await handleSignup(request(),configuration,send);
    assert.equal(response.status,status);
    assert.equal((await response.json()).checkoutUrl,undefined);
  }
});
test('rejects cross-origin posts, invalid input, honeypots, and oversized bodies without saving',async()=>{
  const forbidden=await handleSignup(request(details,{Origin:'https://evil.example'}),env,()=>{throw new Error('Should not save');});
  assert.equal(forbidden.status,403);
  for(const body of [{...details,country:'XX'},{...details,email:'not-an-email'},{...details,name:' '},{...details,name:'line\nbreak'},{...details,currency:{toString:null,valueOf:null}},{...details,membership:'__proto__'},{...details,language:'Other'},{...details,website:'spam'},{...details,signupId:'not-a-uuid'},null]) {
    const result=await handleSignup(request(body),env,()=>{throw new Error('Should not save');});
    assert.equal(result.status,400);
  }
  assert.equal((await handleSignup(request({...details,name:'X'.repeat(5000)}),env,saved)).status,413);
});
test('health endpoint contains no credentials or private spreadsheet identifiers',async()=>{
  const result=await handleSignup(new Request('https://alquimia.example/api/signup'),env);
  assert.deepEqual(await result.json(),{ready:true});
  assert.equal((await handleSignup(new Request('https://alquimia.example/api/signup',{method:'DELETE'}),env)).status,405);
});
test('country choices are unique ISO-style values',()=>{
  assert.equal(new Set(COUNTRY_CODES).size,COUNTRY_CODES.length);
  assert.ok(COUNTRY_CODES.includes('EG')&&COUNTRY_CODES.includes('BR'));
});
test('signup IDs remain UUID v4 when randomUUID is unavailable',()=>{
  const id=createSignupId({getRandomValues:bytes=>{bytes.fill(128);return bytes;}});
  assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

function receiver(){
  const rows=[[...REGISTER_HEADERS]];
  const cache=new Map();
  const range=(row,col,count=1,width=1)=>({
    getValues:()=>Array.from({length:count},(_,r)=>Array.from({length:width},(_,c)=>rows[row-1+r]?.[col-1+c]??'')),
    setValues:values=>{values.forEach((values,r)=>{rows[row-1+r]??=[];values.forEach((value,c)=>{rows[row-1+r][col-1+c]=value;});});},
    setNumberFormat:()=>{},
    createTextFinder:value=>({matchEntireCell(){return this;},findNext:()=>{const i=rows.findIndex((r,i)=>i>0&&r[0]===value);return i<0?null:{getRow:()=>i+1};}}),
  });
  const sheet={getRange:range,getLastRow:()=>rows.length,getMaxRows:()=>1000};
  const context=vm.createContext({
    Date,JSON,Number,String,Math,isNaN,
    ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
    PropertiesService:{getScriptProperties:()=>({getProperty:name=>name==='SIGNUP_SHARED_SECRET'?secret:'test-sheet'})},
    Utilities:{Charset:{UTF_8:'utf8'},computeHmacSha256Signature:(payload,key)=>[...createHmac('sha256',key).update(payload).digest()]},
    LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock:()=>{}})},
    SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush:()=>{}},
    CacheService:{getScriptCache:()=>({get:key=>cache.get(key),put:(key,value)=>cache.set(key,value)})},
  });
  return {rows,context,post:(payload,tamper=false)=>{
    const signature=createHmac('sha256',secret).update(payload).digest('hex');
    return JSON.parse(context.doPost({postData:{contents:JSON.stringify({payload,signature:tamper?'bad':signature})}}).text);
  }};
}
test('receiver appends pending records, deduplicates retries, and preserves confirmed status',async()=>{
  const r=receiver();vm.runInContext(await fs.readFile(new URL('../integrations/google-apps-script/Code.gs',import.meta.url),'utf8'),r.context);
  const record={...details,amount:25,provider:'Stripe',createdAt:new Date().toISOString()};
  const message=()=>JSON.stringify({record,sentAt:Date.now(),rateKey:'a'.repeat(64)});
  assert.equal(r.post(message()).saved,true);
  assert.equal(r.rows.length,2);
  assert.equal(r.rows[1][10],'Awaiting confirmation');
  assert.equal(r.rows[1][12],'Not invited');
  r.rows[1][10]='Paid';r.rows[1][12]='Invited';
  assert.equal(r.post(message()).saved,true);
  assert.equal(r.rows.length,2);
  assert.equal(r.rows[1][10],'Paid');assert.equal(r.rows[1][12],'Invited');
  record.email='changed@example.com';
  assert.equal(r.post(message()).code,'id_conflict');
  assert.equal(r.post(message(),true).code,'unauthorized');
});
test('receiver rejects unsigned traffic, expired payloads, schema changes and formula injection',async()=>{
  const r=receiver();vm.runInContext(await fs.readFile(new URL('../integrations/google-apps-script/Code.gs',import.meta.url),'utf8'),r.context);
  const record={...details,name:'=IMPORTXML("example","data")',amount:25,provider:'Stripe',createdAt:new Date().toISOString()};
  const message=()=>JSON.stringify({record,sentAt:Date.now(),rateKey:'b'.repeat(64)});
  assert.equal(r.post(message(),true).code,'unauthorized');
  assert.equal(r.rows.length,1);
  assert.equal(r.post(JSON.stringify({record,sentAt:0,rateKey:'b'.repeat(64)})).code,'expired');
  assert.equal(r.post(message()).saved,true);
  assert.ok(r.rows[1][2].startsWith("'="));
  r.rows[0][0]='Renamed column';record.signupId='b2234567-1234-4567-9234-123456789012';
  assert.equal(r.post(message()).code,'schema_mismatch');
  assert.equal(r.rows.length,2);
});
test('receiver rate limit blocks new records but permits a safe retry',async()=>{
  const r=receiver();vm.runInContext(await fs.readFile(new URL('../integrations/google-apps-script/Code.gs',import.meta.url),'utf8'),r.context);
  const record={...details,amount:25,provider:'Stripe',createdAt:new Date().toISOString()};
  const post=()=>r.post(JSON.stringify({record,sentAt:Date.now(),rateKey:'c'.repeat(64)}));
  for(let i=0;i<5;i++){record.signupId=`a2234567-1234-4567-9234-12345678901${i}`;assert.equal(post().saved,true);}
  assert.equal(post().saved,true);
  record.signupId='a2234567-1234-4567-9234-123456789019';
  assert.equal(post().code,'rate_limited');
  assert.equal(r.rows.length,6);
});
