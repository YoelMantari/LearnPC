import test from 'node:test';
import assert from 'node:assert/strict';
import {coverage} from '../backend/temario.mjs';
test('Aceptados únicos por identidad, temas compartidos, ayuda desconocida y temas pendientes',()=>{
 const cf={problems:[{id:'cf:1:A',title:'A',tags:['graphs','math']}]};
 const local=[{key:'cf:1:A',labels:['math','Dijkstra'],history:[{result:0},{result:5},{result:5}]},{key:'otro',labels:['KMP'],history:[{result:0}]},{key:'pendiente',labels:['Fenwick'],history:[]}];
 const data=coverage(local,cf);assert.equal(data.rows.length,2);assert.equal(data.rows[0].codes.length,3);assert.equal(data.rows[0].solo,true);assert.equal(data.rows[1].solved,false);
 assert.equal(coverage([],cf).rows[0].solo,false);assert.ok(data.areas.flatMap(a=>a.topics).some(t=>t.title==='Fenwick'));
});
