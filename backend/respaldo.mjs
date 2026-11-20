import {DatabaseSync,backup} from 'node:sqlite';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const dir=new URL('../respaldos/',import.meta.url);await mkdir(dir,{recursive:true});
const db=new DatabaseSync(fileURLToPath(new URL('../datos/algorecall.sqlite',import.meta.url)),{readOnly:true});
const target=fileURLToPath(new URL('AlgoRecall-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite',dir));
try{await backup(db,target);console.log(target)}finally{db.close()}
