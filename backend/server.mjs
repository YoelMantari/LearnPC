import {coverage} from './temario.mjs';
import {saved,sync} from './cf-temas.mjs';
import http from 'node:http';
import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {openDB,identify,summarize,stages} from './model.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),dir=process.env.ALGO_DATA||resolve(root,'datos');await mkdir(dir,{recursive:true});
const db=openDB(resolve(dir,'algorecall.sqlite')),port=Number(process.env.ALGO_PORT||4317);
const sql=(q,...args)=>db.prepare(q).run(...args);
const one=(q,...args)=>db.prepare(q).get(...args);
const txt=(v,max=300)=>String(v??'').trim().slice(0,max);
function num(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw Error('Valor numérico fuera de rango.');return v}
function problem(id){const p=one('SELECT * FROM problems WHERE id=?',id);if(!p)throw Error('Problema inexistente.');return p}
function transaction(fn){db.exec('BEGIN');try{fn();db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
let catalog,cacheTime=0,pending;
const catalogFile=resolve(dir,'codeforces-cache.json');
try{const cached=JSON.parse(await readFile(catalogFile,'utf8'));catalog=new Map(cached.entries);cacheTime=cached.at}catch{}
async function cfCatalog(){if(catalog&&Date.now()-cacheTime<3600000)return catalog;if(!pending)pending=(async()=>{const res=await fetch('https://codeforces.com/api/problemset.problems',{signal:AbortSignal.timeout(9000)});if(!res.ok)throw Error();const data=await res.json();catalog=new Map(data.result.problems.map(p=>['cf:'+p.contestId+':'+p.index,p]));cacheTime=Date.now();try{await writeFile(catalogFile+".tmp",JSON.stringify({at:cacheTime,entries:[...catalog]}));await rename(catalogFile+".tmp",catalogFile)}catch{}return catalog})().catch(error=>{if(catalog)return catalog;throw error}).finally(()=>pending=null);return pending}
function decode(s){return s.replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim()}
async function metadata(p){let title='',tags='',rating='';
 if(p.key.startsWith('cf:')){const item=(await cfCatalog()).get(p.key);if(!item)return false;title=item.name;tags=item.tags.join(', ');rating=String(item.rating??'')}
 else {const u=new URL(p.url);if(!['atcoder.jp','cses.fi','open.kattis.com','www.spoj.com'].includes(u.hostname)||u.port)return false;u.protocol='https:';const res=await fetch(u,{redirect:'error',signal:AbortSignal.timeout(6000)});if(!res.ok)return false;let html='';const decoder=new TextDecoder();for await(const chunk of res.body){html+=decoder.decode(chunk,{stream:true});if(html.length>150000)break}if(u.hostname==='cses.fi')tags=decode(html.match(/<h4[^>]*>\s*([^<>]+)\s*<\/h4>/i)?.[1]||'');
title=decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');}
 if(!title)return false;sql('UPDATE problems SET title=CASE WHEN custom=0 THEN ? ELSE title END,official=?,rating=? WHERE id=?',txt(title),txt(tags,1500),rating,p.id);return true}
const assets=new Map([['/',['index.html','text/html']],['/app.js',['app.js','text/javascript']],['/style.css',['style.css','text/css']],['/temario.js',['temario.js','text/javascript']]]);
const server=http.createServer(async(req,res)=>{function json(value,status=200){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value))}
 try{const path=req.url.split('?')[0];if(req.headers.host!=='127.0.0.1:'+port&&req.headers.host!=='localhost:'+port)return json({error:'Host inválido'},403);
 if(req.method==='GET'&&assets.has(path)){const [file,mime]=assets.get(path);const bytes=await readFile(resolve(root,'frontend',file));res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'"});return res.end(bytes)}
 if(req.method==='GET'&&path==='/api/temario')return json(coverage(summarize(db).ps,await saved(dir)));
 if(req.method==='GET'&&path==='/api/state')return json(summarize(db));
 if(req.method==='GET'&&path==='/api/health')return json({app:'AlgoRecall-Web'});
 if(req.method!=='POST'||!path.startsWith('/api/'))return json({error:'Ruta no encontrada'},404);
 if((req.headers.origin&&req.headers.origin!=='http://'+req.headers.host)||req.headers['content-type']!=='application/json')return json({error:'Solicitud no válida'},403);
 let body='';for await(const chunk of req){body+=chunk;if(body.length>100000)throw Error('Importa menos enlaces por lote.')}const b=JSON.parse(body);let msg='';
 switch(path){
 case '/api/temario/sync': await sync(dir);return json({ok:true});
 case '/api/import':{const list=[...new Set(txt(b.urls,80000).split(/\r?\n/).map(s=>s.trim()).filter(Boolean))];if(!list.length||list.length>100)throw Error('Introduce entre 1 y 100 enlaces.');let added=0;const ids=[];transaction(()=>{for(const raw of list){const p=identify(raw);added+=sql('INSERT OR IGNORE INTO problems(key,url,title,platform) VALUES(?,?,?,?)',p.key,raw,p.title,p.platform).changes;ids.push(one('SELECT id FROM problems WHERE key=?',p.key).id)}});return json({msg:added+' agregados · '+(list.length-added)+' existentes',ids})}
 case '/api/meta':{try{msg=await metadata(problem(b.id))?'Ficha actualizada':'Sin metadatos disponibles'}catch{msg='Enlace guardado. Fuente no disponible.'}break}
 case '/api/edit':{problem(b.id);if(!txt(b.title))throw Error('Escribe un título.');sql('UPDATE problems SET custom=CASE WHEN title<>? THEN 1 ELSE custom END,title=?,tags=? WHERE id=?',txt(b.title),txt(b.title),txt(b.tags,1500),b.id);break}
 case '/api/start':{problem(b.id);const s=one('SELECT * FROM session');if(s&&s.p!==b.id)throw Error('Termina o descarta el intento en curso antes de iniciar otro.');if(!s)sql('INSERT INTO session VALUES(1,?,0,?)',b.id,Date.now());break}
 case '/api/pause':case '/api/resume':case '/api/discard':{const s=one('SELECT * FROM session');if(!s||s.p!==b.id)throw Error('La sesión cambió.');if(path.endsWith('discard'))sql('DELETE FROM session');else if(path.endsWith('pause')&&s.running)sql('UPDATE session SET elapsed=?,running=NULL',s.elapsed+Math.max(0,Date.now()-s.running));else if(path.endsWith('resume')&&!s.running)sql('UPDATE session SET running=?',Date.now());break}
 case '/api/attempt':{problem(b.id);const date=new Date(b.at);if(!Number.isFinite(date.getTime())||date.getTime()>Date.now()+2000)throw Error('Revisa la fecha de práctica.');num(b.minutes,1,100000);num(b.result,0,5);const help=b.result>=1&&b.result<=3?b.help:'';if(help&&!stages.includes(help)||b.result>=1&&b.result<=3&&!help)throw Error('Indica en qué parte necesitaste ayuda.');
 transaction(()=>{const args=[date.toISOString(),b.minutes,b.result,help,txt(b.note,3000)];if(b.attempt){if(!sql('UPDATE attempts SET at=?,minutes=?,result=?,help=?,note=? WHERE id=? AND p=?',...args,b.attempt,b.id).changes)throw Error('Intento inexistente.')}else sql('INSERT INTO attempts(at,minutes,result,help,note,p) VALUES(?,?,?,?,?,?)',...args,b.id);
 if(b.live&&!sql('DELETE FROM session WHERE p=?',b.id).changes)throw Error('El intento ya se cerró.');});const p=summarize(db).ps.find(x=>x.id===b.id);msg=p.reason+' · Próximo repaso '+p.due;break}
 case '/api/settings':sql('UPDATE settings SET minutes=?,share=?,hour=?,notify=?',num(b.minutes,1,1440),num(b.share,0,100),num(b.hour,0,23),b.notify?1:0);break;
 default:return json({error:'Ruta no encontrada'},404)}
 json({msg});}catch(e){json({error:e.message},400)}});
server.listen(port,'127.0.0.1',()=>console.log('AlgoRecall en http://127.0.0.1:'+port));

