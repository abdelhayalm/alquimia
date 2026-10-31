import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output = path.join(root,'public');
await fs.rm(output,{recursive:true,force:true});
await fs.mkdir(output,{recursive:true});
for (const name of await fs.readdir(root)) {
  if (name !== 'worker.js' && /\.(html|css|js)$/.test(name)) await fs.copyFile(path.join(root,name),path.join(output,name));
}
await fs.cp(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
const config = await fs.readFile(path.join(root,'payment-config.js'),'utf8');
const handler = (await fs.readFile(path.join(root,'integrations/signup-handler.js'),'utf8')).replace(/^import .*?;\n/m,'');
const worker = config+'\n'+handler+`\nexport default { async fetch(request,env) {
  if (new URL(request.url).pathname === '/api/signup') return handleSignup(request,env);
  return env.ASSETS.fetch(request);
} };\n`;
await fs.writeFile(path.join(output,'_worker.js'),worker);
await fs.writeFile(path.join(output,'_routes.json'),JSON.stringify({version:1,include:['/api/*'],exclude:[]},null,2));
await fs.writeFile(path.join(output,'_headers'),`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
`);
await fs.writeFile(path.join(output,'.assetsignore'),'_worker.js\n_routes.json\n');
console.log('Built public/ with the website and a self-contained Cloudflare signup worker.');
