import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const html=fs.readFileSync("index.html","utf8");
const admin=fs.readFileSync("moderacion.html","utf8");
const css=fs.readFileSync("assets/tailwind.css","utf8");
function verifyScripts(document,who) {
 let count=0;
 for (const tag of document.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
   if (/type="application\/ld\+json"/.test(tag[1]) || !tag[2].trim()) continue;
   new vm.Script(tag[2],{filename:who+"-inline-"+(++count)+".js"});
 }
 assert.ok(count>=1,who+": sin scripts analizados");
}
verifyScripts(html,"catalogo");
verifyScripts(admin,"moderacion");
assert.match(html,/href="\.\/assets\/tailwind\.css"/);
assert.doesNotMatch(html,/cdn\.tailwindcss\.com/);
assert.match(css,/\.bg-brand-teal/);
assert.match(html,/MODERATED_REVIEWS_URL/);
assert.match(html,/MOODLE_CATALOG_URL/);
assert.match(html,/course-category-filter/);
assert.match(html,/function openPaymentGuide/);
assert.match(html,/GRATIS PARA INTEGRANTES/);
assert.match(admin,/academia_admin_resenas_decidir/);
assert.match(admin,/academia_admin_resenas_importar/);
assert.match(html,/<a\b[^>]*id="academy-admin-link"[^>]*href="\.\/moderacion\.html"/, "Falta el acceso visible al panel administrativo");
assert.match(admin,/<h1>Administración de la Academia<\/h1>/);
assert.match(admin,/db\.auth\.signInWithPassword/);
assert.match(admin,/academia_admin_resenas_listar/);
for (const [page,name] of [[html,"catalogo"],[admin,"moderacion"]]) {
 const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,name+": IDs HTML duplicados");
 for (const m of page.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
   assert.match(m[0],/\brel="[^"]*noopener/,name+": enlace externo inseguro");
 }
 assert.doesNotMatch(page,/MOODLE_TOKEN\s*=/,name+": token en HTML");
}
console.log("OK: sintaxis JS, HTML, CSS compilado, flujos de catálogo y moderación");
