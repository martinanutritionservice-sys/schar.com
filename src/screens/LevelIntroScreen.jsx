import Button from '../components/Button.jsx'
import Header from '../components/Header.jsx'
import Personaje from '../components/Personaje.jsx'
import Estrellas from '../components/Estrellas.jsx'

function formatearMinutos(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LevelIntroScreen({ nivel, onComenzar, onVolver }) {
  const direcciones = {
    facil: 'Palabras en horizontal y vertical.',
    medio: 'Aparecen también en diagonal.',
    dificil: 'Diagonales hacia arriba y hacia abajo.',
    experto: 'En cualquier dirección, ¡incluso al revés!',
  }[nivel.dificultad]

  return (
    <div className="screen">
      <Header onBack={onVolver} />
      <span className="level-intro__badge">NIVEL {nivel.id}</span>
      <h1 className="level-intro__titulo">{nivel.titulo}</h1>
      <div className="level-intro__icono">
        <Personaje nombre="gluten" tamaño="grande" />
      </div>
      <p className="level-intro__texto">Encontrá las {nivel.cantidad} palabras escondidas.</p>
      <div className="intro__reglas glass">
        <p className="intro__dificultad">
          <Estrellas cantidad={nivel.estrellas} /> {nivel.etiqueta}
        </p>
        <ul>
          <li>⏱ {formatearMinutos(nivel.tiempoSegundos)} min</li>
          <li>❤ {nivel.vidas} vidas</li>
          <li>💡 {nivel.pistas === 0 ? 'sin pistas' : `${nivel.pistas} ${nivel.pistas === 1 ? 'pista' : 'pistas'}`}</li>
        </ul>
        <p className="intro__direcciones">{direcciones}</p>
      </div>
      <Button onClick={onComenzar}>¡COMENZAR!</Button>
    </div>
  )
}
