import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {localDay} from '../backend/model.mjs';
test('importación, sesión persistente, corrección cronológica, preferencias y selección de transferencia',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'algorecall-test-')),port=String(20000+Math.floor(Math.random()*20000));let child,ended;
 const start=async()=>{child=spawn(process.execPath,[fileURLToPath(new URL('../backend/server.mjs',import.meta.url))],{env:{...process.env,ALGO_DATA:dir,ALGO_PORT:port},stdio:['ignore','pipe','inherit']});ended=once(child,'exit');await Promise.race([once(child.stdout,'data'),ended.then(()=>{throw Error('Servidor detenido')})])};
 const req=async(name,b)=>{const r=await fetch('http://127.0.0.1:'+port+'/api/'+name,b===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});const v=await r.json();assert.equal(r.status,200,v.error);return v};
 try{await start();const imported=await req('import',{urls:'https://codeforces.com/contest/4/problem/A\nhttps://codeforces.com/problemset/problem/4/A\nhttps://cses.fi/problemset/task/1\nhttps://cses.fi/problemset/task/2'});assert.deepEqual(imported.ids,[1,1,2,3]);
 await req('edit',{id:1,title:'A',tags:'KMP'});await req('edit',{id:3,title:'C',tags:'KMP'});await req('start',{id:1});await req('pause',{id:1});child.kill();await ended;await start();assert.equal((await req('state')).session.p,1);
 const now=new Date();now.setHours(0,0,0,0);const before=new Date(now);before.setDate(before.getDate()-4);
 await req('attempt',{id:1,at:now.toISOString(),result:5,minutes:30,live:true});await req('attempt',{id:1,at:before.toISOString(),result:2,minutes:20,help:'Reconocer la idea'});let s=await req('state');const next=new Date(now);next.setDate(next.getDate()+3);assert.equal(s.ps[0].due,localDay(next));assert.equal(s.session,null);assert.deepEqual(s.metrics.kmp.review,[1,1]);
 await req('attempt',{id:1,attempt:1,at:now.toISOString(),result:4,minutes:30});s=await req('state');assert.equal(s.plan[0].id,3);assert.equal(s.spent,30);assert.equal(s.plan[0].time,27);assert.equal(s.attemptCount,2);
 await req('settings',{minutes:30,share:70,hour:9,notify:false});assert.equal((await req('state')).plan.length,0);
 }finally{if(child&&child.exitCode===null&&!child.killed){child.kill();await ended}await rm(dir,{recursive:true,force:true})}
});
