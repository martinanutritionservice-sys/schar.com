// Mensajes narrativos del juego. Cada situación tiene varias frases y en cada
// partida se sortea una, para que el juego no suene repetido. {nombre} se
// reemplaza por el nombre que puso la persona al registrarse.

const VICTORIA = [
  '¡Misión cumplida, {nombre}! El gluten no tuvo chance.',
  '¡Excelente, {nombre}! Descubriste todo lo que se escondía en el tablero.',
  '¡Detective sin gluten! {nombre}, ya sabés más que ayer.',
  '¡Lo lograste, {nombre}! Tu alacena te lo agradece.',
]

const VICTORIA_PERFECTA = [
  '¡Impecable, {nombre}! Ni un solo error: nivel perfecto.',
  '¡Nivel perfecto! {nombre}, ya podés dar clases de vida sin gluten.',
  '¡Sin una sola falla, {nombre}! Eso es ojo de experto/a.',
]

const DERROTA_VIDAS = [
  '¡Casi, {nombre}! Te quedaste sin vidas, pero cada intento enseña algo.',
  'Uy, {nombre}, el gluten se escondió bien. Ahora el tablero cambia: ¡probá de nuevo!',
  'No pasa nada, {nombre}. Hasta los expertos se equivocan al leer una etiqueta.',
]

const DERROTA_TIEMPO = [
  '¡Se acabó el tiempo, {nombre}! La próxima ya sabés dónde mirar.',
  'El reloj ganó esta vez, {nombre}. ¡Revancha con palabras nuevas!',
  'Tiempo, {nombre}. Respirá hondo y volvé a intentarlo: el tablero es otro.',
]

const ELOGIOS_PALABRA = ['¡MUY BIEN!', '¡EXCELENTE!', '¡LA ENCONTRASTE!', '¡BUEN OJO!', '¡GENIAL!']

const FINAL = {
  dulce: 'Terminaste tu alacena empezando por lo dulce. ¡Merienda asegurada!',
  salado: 'Terminaste tu alacena empezando por lo salado. ¡Picada asegurada!',
  ambos: 'Terminaste tu alacena con lo mejor de los dos mundos: dulce y salado.',
}

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

function conNombre(texto, nombre) {
  return texto.replaceAll('{nombre}', nombre || 'crack')
}

export const mensajeVictoria = (nombre, perfecta) => conNombre(elegir(perfecta ? VICTORIA_PERFECTA : VICTORIA), nombre)
export const mensajeDerrota = (nombre, motivo) => conNombre(elegir(motivo === 'vidas' ? DERROTA_VIDAS : DERROTA_TIEMPO), nombre)
export const elogioPalabra = () => elegir(ELOGIOS_PALABRA)
export const mensajeFinal = (preferencia) => FINAL[preferencia] || FINAL.ambos
