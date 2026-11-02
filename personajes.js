// Personajes educativos del brand book de Schär (estilo lápiz/crayón con
// borde blanco tipo sticker). Un solo lugar para importarlos y elegirlos.
import chico from '../assets/personajes/chico.webp'
import padre from '../assets/personajes/padre.webp'
import madre from '../assets/personajes/madre.webp'
import estudiante from '../assets/personajes/estudiante.webp'
import yoga from '../assets/personajes/yoga.webp'
import gluten from '../assets/personajes/gluten.webp'

export const PERSONAJES = {
  chico: { src: chico, alt: 'Chico con dolor de cabeza' },
  padre: { src: padre, alt: 'Papá corriendo con un rollo de papel higiénico' },
  madre: { src: madre, alt: 'Mamá cansada' },
  estudiante: { src: estudiante, alt: 'Estudiante con dolor de panza' },
  yoga: { src: yoga, alt: 'Chica haciendo yoga' },
  gluten: { src: gluten, alt: 'Gluten, el personaje amarillo' },
}

// Quién acompaña el dato educativo de cada nivel (rota entre los tres
// personajes "afectados").
const POR_NIVEL = ['chico', 'madre', 'estudiante', 'chico', 'madre', 'estudiante']
export const personajeDeNivel = (nivelId) => POR_NIVEL[(nivelId - 1) % POR_NIVEL.length]
