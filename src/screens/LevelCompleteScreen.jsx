import Button from '../components/Button.jsx'
import Confetti from '../components/Confetti.jsx'
import Personaje from '../components/Personaje.jsx'

export default function LevelCompleteScreen({ nombreJugador, resultado, onVerPremio }) {
  const mensaje = resultado?.mensaje || `¡Misión cumplida${nombreJugador ? `, ${nombreJugador}` : ''}!`
  return (
    <div className="screen screen--centrado">
      <Confetti />
      <h1 className="section-title">{resultado?.perfecta ? '¡NIVEL PERFECTO!' : '¡MISIÓN CUMPLIDA!'}</h1>
      <Personaje nombre="yoga" tamaño="grande" />
      <p>{mensaje}</p>
      {resultado && (
        <ul className="resultado glass">
          <li>
            <span>Puntos</span>
            <strong>{resultado.puntaje}</strong>
          </li>
          <li>
            <span>Errores</span>
            <strong>{resultado.errores}</strong>
          </li>
          <li>
            <span>Bonus por vidas</span>
            <strong>+{resultado.bonus}</strong>
          </li>
        </ul>
      )}
      <Button onClick={onVerPremio}>{resultado?.primerVez === false ? 'SEGUIR' : 'VER PREMIO'}</Button>
    </div>
  )
}
