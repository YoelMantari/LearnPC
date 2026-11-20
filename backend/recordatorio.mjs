import {existsSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'node:url';
import {summarize} from './model.mjs';
const file=fileURLToPath(new URL('../datos/algorecall.sqlite',import.meta.url));
let count=0;if(existsSync(file)){const db=new DatabaseSync(file,{readOnly:true});count=summarize(db).plan.length;db.close()}
console.log(count);
