# AlgoRecall Web

Aplicación local de práctica de programación competitiva para Windows. Este directorio es el proyecto editable. Requiere Node.js 24 e incluye todo el código de la interfaz y el servidor. Usa las bibliotecas integradas de Node y SQLite. No necesita instalar paquetes.

## Abrir la aplicación

Haz doble clic en **Abrir AlgoRecall.cmd**. La misma acción sirve para volver a abrir el navegador si el servidor ya está funcionando. Desde una terminal en esta carpeta, el modo de desarrollo es `node --watch backend/server.mjs`. Usa un solo servidor por puerto. La dirección predeterminada es http://127.0.0.1:4317. La interfaz se actualiza al recargar la página.

## Usar el programa

1. En **Biblioteca**, agrega enlaces, uno por línea. Los enlaces importados aparecen aunque el juez no responda. Las variantes de concurso y problemset de Codeforces se unifican por ID.
2. En **Ficha**, edita el título o confirma técnicas sugeridas. Codeforces aporta etiquetas, título y rating cuando su API responde. AtCoder, CSES, Kattis y SPOJ pueden aportar el título. Otros jueces admiten registro manual. Las sugerencias usan palabras del título y etiquetas oficiales. No se envía tu historial a un servicio de IA.
3. En **Hoy**, comienza una práctica. La app muestra el enlace y el cronómetro sin mostrar tus etiquetas ni las notas anteriores. Pausa antes de alejarte. Si cierras el navegador sin pausar, el reloj continúa hasta que lo pauses o finalices el intento. El tiempo se puede corregir antes de guardar.
4. Indica el resultado y, cuando corresponda, en qué parte necesitaste ayuda. En **Historial** puedes corregir cualquier intento. Usa **Biblioteca → Registrar intento** para incorporar sesiones anteriores.
5. Consulta **Progreso** para comparar resoluciones independientes de problemas nuevos y conocidos. Para las estadísticas cuenta como independiente la opción “Solo, reconstruí la idea”.

## Cambiar el proyecto

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| frontend/index.html, frontend/style.css | Estructura general y presentación |
| frontend/app.js | Pantallas, formularios, cronómetro e interacción con la API |
| backend/server.mjs | API HTTP local, validación, registro y consulta de metadatos |
| backend/model.mjs | Esquema SQLite, identidad de los problemas, estadísticas y reglas de repaso |
| tests/flujo.test.mjs | Prueba de integración con base de datos temporal |
| datos/ | Base de datos personal generada al iniciar |

Ejecuta `node --test tests/flujo.test.mjs` desde la raíz del proyecto.

## Planificador

El plan inicial distribuye 90 minutos entre repaso (63) y nuevos (27). El tiempo registrado hoy reduce el presupuesto del bloque correspondiente. Cada primer intento cuenta como nuevo y los siguientes como repaso. Se reserva una plaza para el pendiente más antiguo aunque solo quepa una parte. A continuación, se consideran fallos y ayuda antes que repasos ya resueltos independientemente. Los repasos que no caben conservan su vencimiento.

La estimación de cada problema conocido es la mediana de sus tiempos. Para los nuevos se usan inicialmente 27 minutos, limitados por el presupuesto restante. La práctica se puede pausar o extender. Si antes recordaste el código, el plan da prioridad a un nuevo problema con alguna etiqueta en común.

El intervalo tras un fallo, ayuda o recuerdo literal es un día. Los éxitos independientes avanzan por 1, 3, 7, 14, 30, 60 y 120 días. La secuencia se calcula por fecha real de los intentos. La sección de progreso calcula aciertos por técnica y distingue repasos tras al menos catorce días.

## Recordatorio opcional

El aviso de navegador se activa en Ajustes y requiere que la página siga abierta. Para usar un aviso incluso con el navegador cerrado, abre PowerShell en la carpeta y ejecuta:

    powershell -ExecutionPolicy Bypass -File .\Recordatorio.ps1

Elige la hora local. Esto registra una tarea diaria de Windows para tu usuario. Si quedan problemas en el plan, la tarea pregunta si deseas abrir la aplicación. La sesión de Windows debe estar iniciada. Puedes usar solo uno de los dos tipos de aviso. Para quitar la tarea:

    powershell -ExecutionPolicy Bypass -File .\Recordatorio.ps1 -Modo Quitar

## Datos

La base personal de esta versión web está en datos/algorecall.sqlite. Para respaldarla con el servidor en marcha usa `node backend/respaldo.mjs`; esto genera una copia SQLite consistente en respaldos/. Para restaurar una copia, cierra el servidor y conserva la carpeta datos anterior renombrándola; crea una carpeta datos nueva y coloca en ella la copia con el nombre algorecall.sqlite. Esta versión web mantiene sus datos separados de la aplicación de escritorio anterior.
"# LearnPC" 
