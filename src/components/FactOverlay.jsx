import Button from './Button.jsx'
import Personaje from './Personaje.jsx'
import { personajeDeNivel } from '../data/personajes.js'

// Overlay reutilizable para las interrupciones tipo "¡Muy bien!" que
// aparecen sobre la grilla cada vez que se encuentra una palabra.
export default function FactOverlay({ titulo = '¡MUY BIEN!', palabra, dato, nivelId = 1, onContinuar }) {
  return (
    <div className="overlay">
      <div className="overlay__card">
        <div className="overlay__personaje">
          <Personaje nombre={personajeDeNivel(nivelId)} tamaño="chico" />
        </div>
        <p className="overlay__titulo">{titulo}</p>
        <p className="overlay__subtitulo">Encontraste:</p>
        <h2 className="overlay__palabra">{palabra}</h2>
        <p className="overlay__dato">{dato}</p>
        <Button onClick={onContinuar}>¡SEGUIR!</Button>
      </div>
    </div>
  )
}
