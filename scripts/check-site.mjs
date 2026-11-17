import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {CHECKOUTS,LANGUAGES,checkoutURL,getOffer} from '../payment-config.js';
const root=path.resolve('public');
const pages=new Map();
for(const file of ['index.html','method.html','about.html'])pages.set(file,await fs.readFile(path.join(root,file),'utf8'));
const forbidden=/Portugu[eê]s|Portuguese|InfinitePay|\bBRL\b|R\$|pt-BR/iu;
for(const [file,html] of pages){
  assert.ok(/<html lang="en">/.test(html),`${file}: English page language`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one clear main heading`);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,`${file}: unique canonical`);
  assert.ok(!forbidden.test(html),`${file}: no other market's public offer`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${file}: unique IDs`);
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
  for(const m of html.matchAll(/<img\b[^>]*>/g)){
    assert.ok(/\balt="[^"]*"/.test(m[0]),`${file}: image alt`);
    assert.ok(/\bwidth="\d+"/.test(m[0])&&/\bheight="\d+"/.test(m[0]),`${file}: reserved image dimensions`);
  }
  for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const raw=m[1];if(/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
    const target=new URL(raw,`https://egyptianarabic.alquimias.com/${file==='index.html'?'':file}`);
    let targetPath=target.pathname.slice(1)||'index.html';
    if(['method','about'].includes(targetPath))targetPath+='.html';
    await fs.access(path.join(root,targetPath));
    if(target.hash && pages.has(targetPath))assert.ok(pages.get(targetPath).includes(`id="${target.hash.slice(1)}"`),`${file}: anchor ${raw}`);
  }
}
for(const file of ['payment-config.js','checkout.js','_worker.js'])assert.ok(!forbidden.test(await fs.readFile(path.join(root,file),'utf8')),`${file}: English/USD output`);
assert.deepEqual(Object.keys(CHECKOUTS),['USD']);assert.deepEqual(LANGUAGES,['English']);assert.equal(getOffer('BRL','monthly'),null);
assert.equal(CHECKOUTS.USD.monthly.url,'https://buy.stripe.com/9B614n4Y0epPbY25NW4AU01');
assert.equal(CHECKOUTS.USD.annual.url,'https://buy.stripe.com/4gM6oHbmochH7HM4JS4AU02');
assert.equal(new URL(checkoutURL('USD','annual','test-id','test@example.com','English')).searchParams.get('locale'),'en');
for(const file of ['README.md','docs','tests','integrations','version4.css','pages.css','pages.js','cta.css','qa-responsive.html']){
  await assert.rejects(fs.access(path.join(root,file)),`${file} must not ship`);
}
const sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
for(const url of ['https://egyptianarabic.alquimias.com/','https://egyptianarabic.alquimias.com/method','https://egyptianarabic.alquimias.com/about'])assert.ok(sitemap.includes(url));
assert.ok(!(await fs.readFile(path.join(root,'style.css'),'utf8')).includes('transition:all'));
console.log('PASS: public English/USD scope, preserved Stripe links, local links/assets/anchors, metadata/JSON-LD, image attributes and build exclusions.');
