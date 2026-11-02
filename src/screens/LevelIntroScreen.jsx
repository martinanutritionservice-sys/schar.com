import Button from '../components/Button.jsx'
import Header from '../components/Header.jsx'
import Personaje from '../components/Personaje.jsx'

export default function LevelIntroScreen({ nivel, onComenzar, onVolver }) {
  return (
    <div className="screen">
      <Header onBack={onVolver} />
      <span className="level-intro__badge">NIVEL {nivel.id}</span>
      <h1 className="level-intro__titulo">{nivel.titulo}</h1>
      <div className="level-intro__icono">
        <Personaje nombre="gluten" tamaño="grande" />
      </div>
      <p className="level-intro__texto">Encontrá las {nivel.palabras.length} palabras escondidas.</p>
      <Button onClick={onComenzar}>¡COMENZAR!</Button>
    </div>
  )
}
