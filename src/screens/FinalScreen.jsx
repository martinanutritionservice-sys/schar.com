import { NIVELES, PRODUCTOS } from '../data/levels.js'
import Button from '../components/Button.jsx'
import Confetti from '../components/Confetti.jsx'
import Personaje from '../components/Personaje.jsx'

const TOTAL_PALABRAS = NIVELES.reduce((acc, n) => acc + n.palabras.length, 0)

export default function FinalScreen({ nombreJugador, nivelesCompletados, productosDesbloqueados, palabrasEncontradasTotal, puntajeTotal, onAlacena, onVolverAJugar }) {
  return (
    <div className="screen screen--centrado">
      <Confetti />
      <h1 className="section-title">¡FELICITACIONES{nombreJugador ? `, ${nombreJugador.toUpperCase()}` : ''}!</h1>
      <p>
        Sos un/a <strong className="final__titulo-experto">EXPERTO/A SIN GLUTEN</strong>
      </p>
      <div className="final__personajes">
        <Personaje nombre="chico" tamaño="chico" />
        <Personaje nombre="madre" tamaño="chico" />
        <Personaje nombre="estudiante" tamaño="chico" />
        <Personaje nombre="gluten" tamaño="chico" />
      </div>
      <ul className="final__stats">
        <li>
          <span>Niveles completados</span>
          <strong>
            {nivelesCompletados.length} / {NIVELES.length}
          </strong>
        </li>
        <li>
          <span>Palabras encontradas</span>
          <strong>
            {palabrasEncontradasTotal} / {TOTAL_PALABRAS}
          </strong>
        </li>
        <li>
          <span>Productos desbloqueados</span>
          <strong>
            {productosDesbloqueados.length} / {PRODUCTOS.length}
          </strong>
        </li>
        <li>
          <span>Puntaje final</span>
          <strong>{puntajeTotal} pts</strong>
        </li>
      </ul>
      <Button onClick={onAlacena}>VER MI ALACENA COMPLETA</Button>
      <Button variant="ghost" onClick={onVolverAJugar}>VOLVER A JUGAR</Button>
    </div>
  )
}
