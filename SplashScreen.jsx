import Button from '../components/Button.jsx'
import schaerLogo from '../assets/schar-logo.png'
import Personaje from '../components/Personaje.jsx'

export default function SplashScreen({ onComenzar }) {
  return (
    <div className="screen screen--splash">
      <img src={schaerLogo} alt="Schär — Gluten-Free" className="splash__logo" />
      <h1 className="splash__titulo">
        MISIÓN
        <br />
        SIN GLUTEN
      </h1>
      <Personaje nombre="gluten" tamaño="medio" />
      <p className="splash__subtitulo">APRENDÉ, JUGÁ Y VIVÍ SIN GLUTEN</p>
      <Button onClick={onComenzar}>COMENZAR</Button>
    </div>
  )
}
