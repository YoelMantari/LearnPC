import {classify} from './classify.mjs';
import {DatabaseSync} from 'node:sqlite';
export const results=['Sin resolver','Con editorial','Con ayuda','Con una pista','Solo, recordé el código','Solo, reconstruí la idea'];
export const stages=['Reconocer la idea','Justificar el algoritmo','Implementación o índices','Complejidad','Otra'];
export const localDay=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
function plus(day,n){const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return localDay(d)}
export function identify(raw){
 const u=new URL(raw.trim());if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Introduce un enlace HTTP o HTTPS válido.');
 const host=u.hostname.replace(/^www\./,''), path=u.pathname.replace(/\/+$/,'');let m;
 if(host==='codeforces.com'&&(m=path.match(/^\/(?:problemset\/problem\/(\d+)\/|contest\/(\d+)\/problem\/)([a-z]\d*)$/i)))return {key:'cf:'+(m[1]||m[2])+':'+m[3].toUpperCase(),platform:'Codeforces',title:'Codeforces '+(m[1]||m[2])+m[3].toUpperCase()};
 const known={'atcoder.jp':'AtCoder','cses.fi':'CSES','leetcode.com':'LeetCode','open.kattis.com':'Kattis','spoj.com':'SPOJ'};
 const slug=path.match(/^\/problems\/([^/]+)/)?.[1];u.hash='';return {key:host==='leetcode.com'&&slug?host+'/'+slug:u.host.toLowerCase()+path+u.search,platform:known[host]||host,title:decodeURIComponent((host==='leetcode.com'&&slug)||path.split('/').pop()||host).replace(/[-_]/g,' ')};
}
export function openDB(file){const db=new DatabaseSync(file);db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS problems(id INTEGER PRIMARY KEY,key TEXT UNIQUE,url TEXT,title TEXT,platform TEXT,tags TEXT DEFAULT '',official TEXT DEFAULT '',rating TEXT DEFAULT '',custom INTEGER DEFAULT 0); CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,p INTEGER REFERENCES problems(id),at TEXT,minutes INTEGER,result INTEGER,help TEXT,note TEXT); CREATE INDEX IF NOT EXISTS chronology ON attempts(p,at,id); CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY CHECK(id=1),p INTEGER REFERENCES problems(id),elapsed INTEGER DEFAULT 0,running INTEGER); CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),minutes INTEGER,share INTEGER,hour INTEGER,notify INTEGER); INSERT OR IGNORE INTO settings VALUES(1,90,70,9,0);");return db}
export function summarize(db,day=localDay()){
 const ps=db.prepare('SELECT * FROM problems ORDER BY id').all(), attempts=db.prepare('SELECT * FROM attempts ORDER BY at,id').all(),prefs=db.prepare('SELECT * FROM settings').get();
 for(const p of ps)Object.assign(p,classify({...p,placeholder:identify(p.url).title}));
 const byId=new Map(ps.map(p=>[p.id,Object.assign(p,{history:[],due:null,level:-1,estimate:27,reason:'Primer intento',labels:[...new Set((p.tags+','+p.official+','+p.inferred).split(',').map(s=>s.trim().toLowerCase()).filter(Boolean))]})]));
 let reviewSpent=0,newSpent=0;const metrics=Object.create(null);const intervals=[1,3,7,14,30,60,120];
 for(const a of attempts){const p=byId.get(a.p),fresh=!p.history.length,when=localDay(new Date(a.at));if(when===day){if(fresh)newSpent+=a.minutes;else reviewSpent+=a.minutes}
 for(const tag of p.labels){const t=metrics[tag]??={new:[0,0],review:[0,0],delayed:[0,0]};const buckets=[fresh?t.new:t.review];if(!fresh&&plus(localDay(new Date(p.history.at(-1).at)),14)<=when)buckets.push(t.delayed);for(const v of buckets){v[1]++;if(a.result===5)v[0]++}}
 p.history.push(a);p.level=a.result===5?Math.min(6,p.level+1):0;p.due=plus(when,intervals[p.level]);p.reason=['Reintentar tras un bloqueo','Último intento con editorial','Último intento con ayuda','Último intento con pista','Comprobar comprensión','Repaso espaciado'][a.result];}
 for(const p of ps)if(p.history.length){const m=p.history.map(a=>a.minutes).sort((a,b)=>a-b);p.estimate=Math.round((m[(m.length-1)>>1]+m[m.length>>1])/2)}
 const due=ps.filter(p=>p.due&&p.due<=day).sort((a,b)=>a.due.localeCompare(b.due)||a.id-b.id);
 const queue=due.slice(0,1).concat(due.slice(1).sort((a,b)=>Number(a.history.at(-1).result===5)-Number(b.history.at(-1).result===5)));
 const reviewBudget=Math.round(prefs.minutes*prefs.share/100);let left=Math.max(0,prefs.minutes-reviewSpent-newSpent),r=Math.max(0,reviewBudget-reviewSpent),n=Math.max(0,prefs.minutes-reviewBudget-newSpent);const plan=[];
 for(const p of queue){if(!r||!left)break;if(plan.length&&p.estimate>Math.min(r,left))continue;const time=Math.min(r,left,p.estimate);plan.push({id:p.id,time,kind:'Repaso'});r-=time;left-=time}
 const targets=new Set(ps.filter(p=>p.history.at(-1)?.result===4).flatMap(p=>p.labels));
 for(const p of ps.filter(p=>!p.due).sort((a,b)=>Number(b.labels.some(t=>targets.has(t)))-Number(a.labels.some(t=>targets.has(t))))){if(!n||!left)break;const time=Math.min(p.estimate,n,left);plan.push({id:p.id,time,kind:'Nuevo'});left-=time;n-=time}
 return{ps,plan,prefs,metrics,day,due:due.length,reviewBudget,spent:reviewSpent+newSpent,attemptCount:attempts.length,session:db.prepare('SELECT * FROM session').get()||null,results,stages};
}
