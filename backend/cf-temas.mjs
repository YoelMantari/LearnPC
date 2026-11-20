import {readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
const seed=new URL('./referencias/barsorb.json',import.meta.url);
export async function saved(dir){try{return JSON.parse(await readFile(join(dir,'temario-barsorb.json'),'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;return JSON.parse(await readFile(seed,'utf8'))}}
let syncing;
export async function sync(dir){if(syncing)return syncing;syncing=download(dir).finally(()=>{syncing=null});return syncing}
async function download(dir){const items=new Map();for(let from=1;;from+=1000){
 const url=new URL('https://codeforces.com/api/user.status');url.search=new URLSearchParams({handle:'barsorb',from,count:1000});
 const response=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Codeforces no respondió');
 const data=await response.json();if(data.status!=='OK'||!Array.isArray(data.result))throw Error('Respuesta incompleta');
 for(const s of data.result){if(s.verdict!=='OK'||!s.problem?.contestId||!s.problem.index)continue;const p=s.problem,id='cf:'+p.contestId+':'+p.index;items.set(id,{id,title:p.name,tags:p.tags||[],url:'https://codeforces.com/'+(p.contestId>=100000?'gym':'contest')+'/'+p.contestId+'/problem/'+encodeURIComponent(p.index)})}
 if(data.result.length<1000)break;await new Promise(r=>setTimeout(r,2100))}
 const exportData={handle:'barsorb',checked:new Date().toISOString().slice(0,10),complete:true,problems:[...items.values()]};
 const file=join(dir,'temario-barsorb.json');await writeFile(file+'.tmp',JSON.stringify(exportData));await rename(file+'.tmp',file);return exportData;
}
