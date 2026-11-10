# Misión Sin Gluten — Sopa de letras Schär

Juego web educativo de sopa de letras para **Schär Argentina**, hecho en
**React + Vite + React Router**. Proyecto integrador de *Contenidos y
Creatividad III – Videojuegos: Experiencias Interactivas* (Comunicación
Digital, Universidad de Palermo).

- **Juego online:** https://scharcom-nu.vercel.app
- **Autora:** Martina Osorio

## Concepto

Una sopa de letras que se juega arrastrando el dedo (o el mouse) sobre las
letras, como en papel, pero con una misión: **aprender qué es la celiaquía y
cómo es vivir sin gluten** mientras se completan 6 niveles. Cada palabra
encontrada revela un dato educativo y, al terminar un nivel, se desbloquean
productos Schär reales que se guardan en una "alacena" personal.

- **Público:** personas jóvenes y adultas que consumen o conocen la marca,
  celíacas o no, y sus familias y amigos. Se juega desde el celular, sin
  instalar nada.
- **Temática:** celiaquía, alimentación sin gluten y productos Schär,
  con el tono cercano y los personajes educativos del brand book de la marca.
- **Objetivo comunicacional:** que la marca se viva como una experiencia
  (jugar, aprender, coleccionar) y no como un mensaje publicitario.

## Cómo correrlo

```bash
npm install
npm run dev       # http://localhost:5173
```

Build de producción:

```bash
npm run build
npm run preview
```

## Navegación (React Router)

Cada pantalla tiene su propia dirección, así se puede recargar o compartir
sin perder el lugar. Las rutas que lo necesitan están protegidas: si todavía
no pusiste tu nombre te llevan a registrarte; un nivel bloqueado, un premio
inexistente o la pantalla final sin haber terminado redirigen donde
corresponde.

| Ruta | Pantalla |
|---|---|
| `/` | Bienvenida |
| `/nombre` | Registro del jugador |
| `/preferencia` | ¿Dulce o salado? |
| `/inicio` | Menú principal |
| `/como-jugar` | Instrucciones |
| `/niveles` | Selección de nivel |
| `/nivel/:id` | Presentación del nivel (tiempo, vidas, pistas, dificultad) |
| `/nivel/:id/jugar` | El juego |
| `/nivel/:id/completo` | Misión cumplida |
| `/premio` y `/premio/producto` | Producto desbloqueado y guardado en la alacena |
| `/alacena` | Colección con filtro dulce/salado y zoom |
| `/final` | Cierre del juego (solo si se completaron los 6 niveles) |
| `*` | Página 404 con personaje |

Para que las direcciones funcionen al recargar en Vercel, el archivo
`vercel.json` redirige todo a `index.html`.

## Mecánica

- **Sopa de letras generada en cada partida** (`src/hooks/useWordSearch.js`):
  grilla fija de 10 × 10, palabras en direcciones aleatorias según el nivel y
  relleno con letras al azar. Si una palabra no entra, el tablero se
  vuelve a armar, así que nunca queda una palabra imposible de encontrar.
- **Palabras al azar:** cada nivel tiene un *banco* de 8 a 10 palabras con su
  dato educativo y en cada partida se sortean algunas. Reintentar un nivel
  trae palabras y tablero nuevos.
- **Arrastre tipo papel:** se apoya en la primera letra, se desliza hasta la
  última y se suelta; un trazo tipo resaltador acompaña el recorrido.
- **Vidas, cronómetro y pistas:** un error resta una vida; el reloj se pone
  rojo cuando queda poco; la pista marca la primera letra de una palabra
  pendiente.
- **Puntaje:** 100 puntos por palabra + bonus por las vidas que sobran.
- **Progreso guardado** en el navegador (`localStorage`): nombre, gusto,
  niveles, alacena y premios pendientes. "¿No sos …? Empezar de nuevo" lo borra.

## Niveles y dificultad progresiva

Todo lo que cambia de un nivel a otro está en un solo lugar
(`src/data/levels.js`), así se puede ajustar sin tocar la lógica.

| Nivel | Tema | Palabras | Tiempo | Vidas | Pistas | Direcciones |
|---|---|---|---|---|---|---|
| 1 · Fácil | Conocé la celiaquía | 4 | 2:00 | 5 | 3 | → ↓ |
| 2 · Fácil | ¿Dónde está el gluten? | 5 | 2:00 | 5 | 3 | → ↓ |
| 3 · Medio | Vivir sin gluten | 6 | 1:55 | 4 | 2 | → ↓ ↘ |
| 4 · Medio | Desafío Schär | 6 | 1:50 | 4 | 2 | → ↓ ↘ |
| 5 · Difícil | Mitos y verdades | 7 | 1:45 | 3 | 1 | → ↓ ↘ ↗ |
| 6 · Experto | Cocina casera | 8 | 1:40 | 3 | 0 | las 8, incluso al revés |

Son 36 palabras por partida completa, tomadas de bancos de 54 palabras en total.

## Personalización

- **Nombre:** saluda en el inicio, en los mensajes de victoria y derrota y en
  la pantalla final.
- **Dulce o salado:** al registrarse se elige un gusto (dulce, salado o los
  dos). Decide qué productos Schär se desbloquean primero, se muestra con
  una insignia en cada producto, hay filtro en la alacena y el cierre del juego
  habla de ese perfil (`src/data/levels.js`, función `elegirPremios`).
- **Narrativa propia:** mensajes de victoria, de "nivel perfecto", de derrota
  por vidas y de derrota por tiempo, sorteados al azar y con el nombre de la
  persona (`src/data/mensajes.js`). Los personajes educativos del brand book
  acompañan cada momento.
- **Productos reales:** 12 packagings de Schär en formato sticker, con zoom
  al tocarlos.

## Diseño visual

- **Paleta y tipografía** del brand book de Schär: rojo `#CF003E`, amarillo
  `#FEC900`, marrón `#3D2B30`, crema `#F7F1EA` y verde `#60813F`. Títulos en
  Playfair Display y textos en Nunito Sans.
- **Glassmorphism:** fondo en degradé cálido con manchas de color de la marca
  que flotan lento, y paneles de vidrio esmerilado (`backdrop-filter: blur`,
  fondo blanco translúcido, borde claro y sombra suave) en listas de niveles,
  tablero, tarjetas de producto, ventanas emergentes y botones secundarios.
  El botón principal queda en rojo sólido para mantener el contraste. Si el
  navegador no soporta `backdrop-filter`, el vidrio se vuelve más opaco para
  que todo siga leyéndose, y las animaciones se desactivan si la persona lo
  pidió en su sistema.
- **Tamaño fijo tipo celular** (390 × 844) que se escala entero según la
  ventana, así el diseño se ve igual en cualquier pantalla.

## Estructura del proyecto

```
src/
  data/        niveles, bancos de palabras, productos y mensajes
  context/     estado global del juego (jugador, gusto, progreso)
  hooks/       lógica de la sopa de letras y escala de pantalla
  components/  piezas reutilizables (botón, tarjetas, zoom, listas, etc.)
  screens/     una pantalla por archivo
  utils/       progreso guardado y sonido (Web Audio API, sin archivos externos)
  App.jsx      mapa de rutas y marco del juego
```

## Prueba de usabilidad y ajustes

Se probó el juego con 7 personas externas al proyecto y se anotaron sus
sugerencias. Cada una derivó en un cambio concreto:

- **Fecha de la prueba:** 2 de noviembre de 2026
- **Participantes:** 7 personas: 3 compañeros de la materia y 4 compañeros de trabajo
- **Dispositivos usados:** computadora (compañeros de la materia) y celular (compañeros de trabajo)

| Sugerencia recibida | Cambio realizado |
|---|---|
| Aumentar la cantidad de palabras | De 3 a entre 4 y 8 palabras por nivel (36 por partida) |
| Agrandar / "apretar el zoom" de cada producto | Fotos más grandes en la alacena y el premio, y zoom al tocar cualquier producto |
| Bajar las pistas según el juego | Las pistas bajan de nivel en nivel: 3, 3, 2, 2, 1 y 0 |
| Personalizar productos y tema salado / dulce | Pantalla "¿dulce o salado?", orden de premios según el gusto, insignias y filtro en la alacena |
| Pensar qué más suma a la dificultad de cada nivel | Menos tiempo por palabra, menos vidas, nuevas direcciones (diagonales y al revés), etiqueta y estrellas por nivel |
| Que sea aleatorio | Bancos de palabras: cada partida sortea palabras distintas y arma un tablero nuevo |
| Menos tiempo y menos pistas, con dificultad creciente | Tiempo total de 2:00 a 1:40 mientras las palabras pasan de 4 a 8 |

Otros ajustes que salieron al probar y revisar el juego: el trazo del
resaltador se desalineaba con el marco escalado; si el dedo soltaba muy
rápido se perdía la última letra (ahora el arrastre se guarda al instante); y
en el zoom de producto la X de cerrar quedaba tapada por la foto.

## Proceso de desarrollo asistido por IA

El juego se construyó conversando con Claude (Anthropic) como asistente de
programación, con Martina a cargo de la idea, la dirección de arte y las
decisiones:

1. **Idea y consigna:** Martina definió el concepto, el público, los niveles,
   el uso del brand book y los productos reales de Schär.
2. **Construcción por iteraciones:** se fue pidiendo una mejora por vez
   (arrastre con resaltador, personajes, packagings, botón de inicio,
   dificultad, progreso guardado, despliegue) y revisando el resultado en
   pantalla antes de seguir.
3. **Pruebas:** la IA escribió pruebas automáticas con un navegador real
   (Playwright) que recorren el juego completo: rutas protegidas, los 6
   niveles, derrota por vidas y por tiempo, premios según el gusto, alacena,
   zoom, progreso guardado y arrastre táctil. También comprobó miles de
   tableros generados para asegurar que todas las palabras entran.
4. **Revisión humana:** Martina probó el juego con otras personas y decidió
   qué cambiar a partir de lo que dijeron; esos cambios son el punto anterior.
5. **Contenido:** los datos educativos de cada palabra fueron redactados con
   ayuda de la IA y revisados por Martina antes de la publicación.

## Checklist de la entrega (Momento 3)

- **Mecánicas y navegación completas con React Router:** rutas, protecciones
  y 404.
- **Diseño pulido:** glassmorphism, paleta de marca y animaciones suaves.
- **Personalización narrativa:** mensajes propios de victoria y derrota,
  nombre, gusto y personajes.
- **Pruebas de usabilidad:** documentadas arriba, con sus ajustes.
- **Despliegue:** Vercel (`vercel.json` incluido).
- **Repositorio:** este README, estructura ordenada y sin archivos de más.
