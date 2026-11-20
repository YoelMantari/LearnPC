// Cada línea define una familia. Cada tema admite su nombre y sus alias exactos.
const curriculum = `Fundamentos e implementación
Implementación|implementation;Simulación|simulation;Ad hoc|adhoc;Complejidad temporal y espacial|complexity;Entrada y salida;Precisión numérica|floating point;Aritmética de precisión arbitraria|big integer;Construcción de soluciones|constructive algorithms;Problemas interactivos|interactive;Problemas de salida|output only
Búsqueda y paradigmas
Fuerza bruta|brute force|complete search;Recursión|recursion;Backtracking|vuelta atrás;Poda|pruning;Divide y vencerás|divide and conquer;Encuentro en el medio|meet-in-the-middle;Búsqueda binaria|binary search;Búsqueda binaria sobre la respuesta;Búsqueda ternaria|ternary search;Algoritmos voraces|greedy;Selección de intervalos;Intercambio y argumentos de optimalidad
Ordenamiento y recorridos
Ordenamiento|sortings|sorting;Comparadores;Ordenamiento por conteo|counting sort;Inversiones|inversions;Compresión de coordenadas|coordinate compression;Dos punteros|two pointers;Ventana deslizante|sliding window;Subarreglo máximo|kadane;Barrido|sweep line|line sweep;Búsqueda de ciclos|cycle finding|floyd cycle
Bits y subconjuntos
Máscaras de bits|bitmasks|bitmask;Conteo de bits|popcount;XOR;Enumeración de submáscaras;Bitsets|bitset;Base lineal XOR|xor basis
Estructuras de datos
Estructuras de datos (general)|data structures;Arreglos y matrices|arrays;Listas enlazadas|linked list;Pilas y colas|stack|queue|deque;Pila y cola monótonas|monotonic stack|monotonic queue;Diccionarios y conjuntos|map|set|hash table;Cola de prioridad|heap|priority queue;Árboles balanceados|balanced bst|treap;Conjuntos disjuntos|dsu|union find|disjoint set union;Persistencia|persistent data structures;Retroceso de estructuras|rollback
Consultas de rango
Sumas prefijas|prefix sums|prefix sum;Sumas prefijas 2D|2d prefix sum;Arreglos de diferencias|difference array;Fenwick|fenwick tree|binary indexed tree;Árbol de segmentos|segment tree;Propagación diferida|lazy propagation;Tabla dispersa|sparse table;Descomposición en bloques|sqrt decomposition;Algoritmo de Mo|mo's algorithm;Consultas fuera de línea|offline queries;Ventana de mínimo o máximo|sliding window minimum;Árbol de ondículas|wavelet tree;Consultas de rango (general)|range queries
Programación dinámica
Programación dinámica (general)|dp|dynamic programming|programación dinámica;Mochila|knapsack;Cambio de monedas|coin change;Subsecuencia creciente|lis|longest increasing subsequence;Subsecuencia común|lcs;Distancia de edición|edit distance;DP por intervalos|interval dp;DP en grillas|grid dp;DP en DAG|dag dp;DP de árboles|tree dp;DP con máscaras|bitmask dp;DP de dígitos|digit dp;DP de perfiles|profile dp;DP de subconjuntos|sos dp;Optimización con división y conquista|divide and conquer dp;Optimización con envolvente de rectas|convex hull trick|li chao tree;Optimización de Knuth|knuth optimization
Grafos
Grafos (general)|graphs|graph algorithms;Modelado y representación;DFS y BFS|dfs and similar|dfs|bfs;Componentes conexas|connected components;Bipartición|bipartite graphs;Orden topológico|topological sort;Componentes fuertemente conexas|scc;Puentes y articulaciones|bridges|articulation points;Caminos mínimos (general)|shortest paths|shortest path|caminos mínimos;Dijkstra;BFS 0-1|0-1 bfs;Bellman–Ford|bellman ford;Floyd–Warshall|floyd warshall;Árbol de expansión mínima|mst|kruskal|prim;Caminos eulerianos|eulerian path;Caminos hamiltonianos|hamiltonian path;Grafos funcionales|functional graph;2-SAT|2sat|2-sat
Árboles
Árboles (general)|trees;Diámetro y centros|tree diameter;Recorrido de Euler|euler tour;Saltos binarios|binary lifting;Ancestro común más bajo|lca;Descomposición pesada-ligera|heavy light decomposition|hld;Descomposición por centroides|centroid decomposition;Reenraizamiento|rerooting;Unión de pequeños a grandes|small to large|dsu on tree;Isomorfismo de árboles|tree isomorphism
Flujos y emparejamientos
Flujo (general)|flows;Flujo máximo y corte mínimo|max flow|min cut|dinic;Flujo de costo mínimo|min cost flow;Emparejamiento (general)|graph matchings|matchings;Emparejamiento bipartito|bipartite matching|hopcroft karp;Asignación óptima|hungarian algorithm;Cobertura mínima de vértices|minimum vertex cover
Matemática y teoría de números
Matemática (general)|math;Teoría de números (general)|number theory;Divisibilidad y divisores|divisors;MCD y MCM|mcd|gcd|lcm|mcd / mcm;Números primos|primes|primality;Criba de Eratóstenes|sieve of eratosthenes;Criba segmentada|segmented sieve;Factorización|factorization;Aritmética modular|modular arithmetic;Exponenciación binaria|binary exponentiation;Euclides extendido e inversos|extended euclid|modular inverse;Teorema chino del resto|chinese remainder theorem|crt;Función de Euler|totient;Función de Möbius|mobius;Ecuaciones diofánticas|diophantine equations;Miller–Rabin|miller rabin;Pollard rho|pollard's rho;Sistemas de numeración|number systems
Combinatoria y probabilidad
Combinatoria (general)|combinatorics;Permutaciones|permutations;Coeficientes binomiales|binomial coefficients;Inclusión-exclusión|inclusion exclusion;Principio del palomar|pigeonhole principle;Números de Catalan|catalan;Burnside y Pólya|burnside;Probabilidad|probabilities|probability;Esperanza matemática|expected value;Algoritmos aleatorizados|randomized algorithms;Cadenas de Markov|markov chains
Álgebra y métodos numéricos
Álgebra lineal|linear algebra;Matrices|matrices;Exponenciación de matrices|matrix exponentiation;Eliminación de Gauss|gaussian elimination;Recurrencias lineales|linear recurrences;Polinomios|polynomials;FFT y convolución|fft|convolution;Transformada modular|ntt;Interpolación|interpolation;Integración y aproximación numérica|numerical methods
Cadenas
Cadenas (general)|strings;Búsqueda de patrones|string matching;Función prefijo y KMP|kmp|prefix function;Función Z|z-function|z function;Hash de cadenas|string hashing|rolling hash;Trie|tries;Aho–Corasick|aho corasick;Arreglo de sufijos y LCP|suffix array|lcp;Árbol de sufijos|suffix tree;Autómata de sufijos|suffix automaton;Palíndromos y Manacher|manacher|palindromes;Bordes y periodicidad|borders|periodicity;Alineamiento de secuencias|sequence alignment;Autómatas|automata;Análisis sintáctico y expresiones|expression parsing
Geometría computacional
Geometría (general)|geometry;Puntos y vectores|vectors;Producto cruzado y orientación|cross product|orientation;Rectas y segmentos|lines|segment intersection;Distancias y proyecciones|projection;Triángulos|triangles;Círculos|circles;Polígonos|polygons;Área y punto en polígono|point in polygon;Envolvente convexa|convex hull;Calibradores rotatorios|rotating calipers;Par de puntos más cercano|closest pair;Intersección de semiplanos|half plane intersection;Geometría 3D|3d geometry
Juegos y estrategias
Teoría de juegos (general)|games|game theory;Estados ganadores y perdedores|winning states;Nim;Sprague–Grundy|sprague grundy;Minimax;Juegos con estrategia constructiva|strategy stealing`;
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\d]+/gu,' ').trim();
const lines=curriculum.split('\n');
export const areas=[];const lookup=new Map();
for(let i=0;i<lines.length;i+=2){const topics=lines[i+1].split(';').map((raw,j)=>{const [title,...aliases]=raw.split('|'),code=(i/2+1)+'.'+(j+1);for(const a of [title,...aliases])lookup.set(norm(a),code);return {code,title}});areas.push({title:lines[i],topics})}
export function coverage(local,cf){
 const records=new Map();
 for(const p of cf.problems)records.set(p.id,{key:p.id,title:p.title,url:p.url,tags:new Set(p.tags),solved:true,solo:false,accepted:true,attempted:true});
 for(const p of local){const r=records.get(p.key)||{key:p.key,title:p.title,url:p.url,tags:new Set(),solved:false,solo:false,accepted:false,attempted:false};for(const t of p.labels)r.tags.add(t);r.solo=p.history.some(a=>a.result===5);r.solved||=p.history.some(a=>a.result>0);r.attempted||=p.history.length>0;if(r.attempted)records.set(p.key,r)}
 const rows=[...records.values()].map(({tags,...r})=>({...r,codes:[...new Set([...tags].map(t=>lookup.get(norm(t))).filter(Boolean))]}));return {areas,rows,handle:cf.handle,checked:cf.checked,complete:cf.complete,external:cf.problems.length}
}
