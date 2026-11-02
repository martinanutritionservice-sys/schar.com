import Button from '../components/Button.jsx'
import Confetti from '../components/Confetti.jsx'
import Personaje from '../components/Personaje.jsx'

export default function LevelCompleteScreen({ nombreJugador, onVerPremio }) {
  return (
    <div className="screen screen--centrado">
      <Confetti />
      <h1 className="section-title">¡MISIÓN CUMPLIDA{nombreJugador ? `, ${nombreJugador.toUpperCase()}` : ''}!</h1>
      <Personaje nombre="yoga" tamaño="grande" />
      <p>Encontraste todas las palabras.</p>
      <Button onClick={onVerPremio}>VER PREMIO</Button>
    </div>
  )
}
