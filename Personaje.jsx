import { PERSONAJES } from '../data/personajes.js'

// Dibuja uno de los personajes educativos del brand book.
// tamaño: 'chico' | 'medio' | 'grande'
export default function Personaje({ nombre, tamaño = 'medio', className = '' }) {
  const p = PERSONAJES[nombre]
  if (!p) return null
  return <img src={p.src} alt={p.alt} className={`personaje personaje--${tamaño} ${className}`.trim()} draggable="false" />
}
