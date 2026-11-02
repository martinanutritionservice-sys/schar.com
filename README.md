# Misión Sin Gluten — Sopa de letras Schär

Juego educativo hecho en React + Vite para la materia Contenidos y
Creatividad 3. El jugador se registra con su nombre, recorre 6 niveles
temáticos sobre celiaquía y vida sin gluten, resuelve una sopa de letras
que se genera de forma distinta en cada partida arrastrando el dedo o el
mouse (como en una sopa de letras de papel), aprende un dato por cada
palabra encontrada y va desbloqueando productos Schär para su "alacena".

## Cómo correrlo

```bash
npm install
npm run dev       # http://localhost:5173
```

Para una build de producción:

```bash
npm run build
npm run preview
```

## Cómo se cumple la checklist

- **Proyecto React funcionando** — armado con Vite (`npm run dev` /
  `npm run build` sin errores).
- **Componentes identificados** — separados en `src/screens` (13
  pantallas del flujo, incluyendo el registro del nombre) y
  `src/components` (piezas reutilizables), incluyendo `Header` y
  `Footer` como componentes propios usados en casi todas las pantallas
  (además de la App, botones e interactivos).
- **Primera pantalla construida** — `SplashScreen` + `NameScreen` +
  `HomeScreen`.
- **Al menos un componente reutilizable** — `Button`, `Header`,
  `Footer`, `ProductCard`, `ProgressBar`, `LivesIndicator` y
  `WordList` se usan en varias pantallas distintas, cada vez con
  props diferentes.
- **Props utilizadas correctamente** — toda la navegación y los datos
  (nombre del jugador, nivel actual, progreso, productos) viajan por
  props desde `App.jsx` hacia las pantallas; ninguna pantalla conoce a
  otra directamente.
- **Al menos un estado con useState** — `App.jsx` guarda la pantalla
  activa, el nombre del jugador y el progreso; `GameScreen` guarda
  vidas, tiempo, palabras encontradas y puntaje; el hook
  `useWordSearch` guarda la grilla y el arrastre en curso.
- **Al menos un evento** — eventos de puntero (`onPointerDown` +
  `pointermove`/`pointerup` globales) que arman el arrastre de punta a
  punta de cada palabra, más los clicks de botones en toda la app.
- **Algún comportamiento dinámico** — la sopa de letras se genera de
  cero en cada partida (`src/hooks/useWordSearch.js`): palabras
  ubicadas en direcciones aleatorias y relleno con letras al azar.
  También corren un cronómetro (con aviso visual cuando queda poco
  tiempo) y un sistema de vidas en tiempo real.
- **Estructura de archivos organizada**:

  ```
  src/
    data/       contenido del juego (niveles, palabras, productos)
    hooks/      lógica de la sopa de letras, separada de la UI
    components/ piezas reutilizables (botón, tarjetas, listas, etc.)
    screens/    una pantalla por archivo, siguiendo el mockup
    utils/      sonido (Web Audio API, sin archivos externos)
    App.jsx     controla la navegación y el progreso del jugador
  ```

## Contenido

6 niveles (`src/data/levels.js`), 3 palabras cada uno, cada palabra con
su propio dato educativo sobre celiaquía y vida sin gluten. Al
completar un nivel aparece un popup de premio y se desbloquean 2
productos Schär (12 en total) que se guardan en "Mi Alacena".

## Interacción y diseño

- **Nombre del jugador**: antes de arrancar se pide un nombre
  (`NameScreen`), que después personaliza el saludo de Home y las
  pantallas de nivel completado, derrota y final.
- **Selección por arrastre**: se marca una palabra apoyando el dedo o
  el mouse en su primera letra y arrastrando hasta la última, igual que
  en papel — no hace falta tocar dos veces.
- **Tamaño de pantalla fijo**: la app se ve siempre del mismo tamaño
  (ancho de un iPhone estándar, 390px), tanto en el celular como en
  una ventana de escritorio, en vez de estirarse según la pantalla.
- **Sonido**: efectos sintetizados con Web Audio API (sin archivos de
  audio externos) para acierto, error y victoria, con un botón para
  silenciar en la pantalla de inicio.

## Diseño (actualización)

- Paleta y tipografías tomadas del brand book de Schär: rojo `#CF003E`, amarillo `#FEC900`, marrón `#3D2B30`, beige `#DBC8B7`. Títulos en Playfair Display (parecida a Times Extra Bold) y textos en Nunito Sans (parecida a Museo Sans); se instalan con `npm install` (paquetes `@fontsource`).
- Personajes educativos del brand book (`src/assets/personajes/`): el gluten acompaña la bienvenida y la intro de cada nivel; el chico, la madre y la estudiante acompañan el dato educativo; el padre aparece en "¡Casi!" y la chica de yoga en "Misión cumplida".
- Los 12 productos son packagings reales de Schär (`src/assets/productos/`), recortados como stickers; se definen en `src/data/levels.js`.

## Dificultad

- Niveles 1-2: las palabras van solo en → y ↓. Niveles 3-4: se suma la diagonal ↘. Niveles 5-6: se suma la diagonal ↗. Nunca van "al revés".
- Más tiempo por nivel (90 a 100 segundos), una grilla fija de 10 x 10 en TODOS los niveles (misma medida y mismo tamaño de letra) y botón 💡 PISTA (3 por nivel) que marca la primera letra de una palabra pendiente.

## Progreso guardado

El nombre, los niveles completados y la alacena se guardan en el navegador (localStorage), así que recargar la página no borra nada. En el inicio hay un enlace "¿No sos …? Empezar de nuevo" que borra el progreso y vuelve al registro. El nivel 4 usa palabras de los productos reales que se ganan en ese nivel (Choco Chip Cookies y María).
