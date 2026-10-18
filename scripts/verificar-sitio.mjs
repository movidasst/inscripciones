import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
assert.match(html,/<!doctype html>/i);
assert.match(html,/MOODLE_CATALOG_URL/);
assert.match(html,/payload\.source\s*!==\s*"moodle"/);
assert.match(html,/payload\.stale\s*===\s*true/);
assert.match(html,/raw\.origen\s*!==\s*"moodle"/);
assert.match(html,/courseFromMoodle/);
assert.match(html,/courses\.map\(courseFromMoodle\)/);
for(const id of ["cursos","pagos","comunidad"]){
  assert.match(html,new RegExp('id="tab-'+id+'"'),"Falta pestaña "+id);
  assert.match(html,new RegExp('id="view-'+id+'"'),"Falta contenido "+id);
}
assert.match(html,/Copiar datos completos/);
assert.match(html,/https:\/\/movidasst\.org\/login\/index\.php/);
assert.match(html,/https:\/\/chat\.whatsapp\.com\//);
assert.match(html,/https:\/\/whatsapp\.com\/channel\//);
assert.doesNotMatch(html,/moderacion\.html|academy-admin-link|MODERATED_REVIEWS_URL|URL_GOOGLE_SCRIPT|mockData|MODO_DEMO|openModal|Valorar curso|Reseñas de la comunidad/i);
const inlineScripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.equal(inlineScripts.length,1,"Se espera un único script");
new vm.Script(inlineScripts[0][1],{filename:"academia-inline.js"});
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,"IDs HTML duplicados");
for(const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)){
  assert.match(m[0],/\brel="[^"]*noopener/,"Enlace externo sin noopener");
}
assert.doesNotMatch(html,/MOODLE_TOKEN\s*=/,"Token de Moodle expuesto");
console.log("OK: tres pestañas, catálogo real de Moodle, sin administración/reseñas/demo, JS y enlaces válidos");
