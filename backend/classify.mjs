// Local reference records also work when the judge cannot be reached.
const reference=new Map([
 ['cf:579:A',{title:'Raising Bacteria',official:'bitmasks',rating:'1000'}],
 ['cses.fi/problemset/task/1622',{title:'Creating Strings',official:'Introductory Problems',technique:'Permutaciones'}],
 ['spoj.com/problems/PRIME1',{title:'Prime Generator',technique:'Números primos, Criba segmentada'}],
]);
const rules=[
 [/\b(prime|primes|primality)\b/i,'Números primos'],
 [/\b(permutations?|permutaciones)\b/i,'Permutaciones'],
 [/\b(gcd|greatest common divisor)\b/i,'MCD'],
 [/\b(shortest path|shortest routes)\b/i,'Caminos mínimos'],
 [/\b(segment tree|fenwick|binary search|backtracking|knapsack|suffix array|kmp)\b/i,null],
];
export function classify(p){
 const key=p.key.replace(/^www\./,'').split('?')[0].replace(/\/$/,'');
 const ref=reference.get(key)||{};
 const title=p.title===p.placeholder?ref.title||p.title:p.title;
 const inferred=new Set((ref.technique||'').split(', ').filter(Boolean));
 for(const [pattern,name] of rules){const match=title.match(pattern);if(match)inferred.add(name||match[0].toLowerCase())}
 return {title,official:p.official||ref.official||'',rating:p.rating||ref.rating||'',inferred:[...inferred].join(', ')};
}
