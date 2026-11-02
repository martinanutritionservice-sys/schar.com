import Button from '../components/Button.jsx'
import Confetti from '../components/Confetti.jsx'

// Pantalla del premio: el producto real "sale" con rayos de fondo, destellos
// y una cinta de "gratis", como sticker que se pega en tu alacena.
export default function PrizeScreen({ producto, onSumarAlacena }) {
  return (
    <div className="screen screen--centrado screen--premio">
      <Confetti />
      <span className="prize__cinta">¡GRATIS PARA TU ALACENA!</span>
      <h1 className="section-title">¡DESBLOQUEASTE UN NUEVO PRODUCTO!</h1>
      <div className="prize__escenario">
        <div className="prize__rayos" aria-hidden="true" />
        <span className="prize__destello prize__destello--1" aria-hidden="true">✦</span>
        <span className="prize__destello prize__destello--2" aria-hidden="true">✦</span>
        <span className="prize__destello prize__destello--3" aria-hidden="true">✦</span>
        <span className="prize__destello prize__destello--4" aria-hidden="true">✦</span>
        {producto.imagen ? (
          <img className="prize__foto" src={producto.imagen} alt={producto.nombre} />
        ) : (
          <div className="prize__emoji">{producto.emoji}</div>
        )}
      </div>
      <p className="prize__nombre">{producto.nombre}</p>
      <Button onClick={onSumarAlacena}>¡SUMALO A TU ALACENA!</Button>
    </div>
  )
}
