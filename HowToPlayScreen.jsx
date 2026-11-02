import Button from '../components/Button.jsx'
import Header from '../components/Header.jsx'

const ITEMS = [
  { icono: '👆', texto: 'Arrastrá desde la primera hasta la última letra de cada palabra, como en una sopa de letras de papel.' },
  { icono: '💡', texto: 'Aprendé con cada palabra que descubrís.' },
  { icono: '🏆', texto: 'Superá los niveles y completá desafíos.' },
  { icono: '🎁', texto: 'Desbloqueá productos Schär y sumalos a tu alacena.' },
]

export default function HowToPlayScreen({ onVolver, onJugar }) {
  return (
    <div className="screen">
      <Header onBack={onVolver} title="¿CÓMO JUGAR?" />
      <ul className="howto-list">
        {ITEMS.map((item) => (
          <li key={item.texto} className="howto-list__item">
            <span className="howto-list__icono">{item.icono}</span>
            <span>{item.texto}</span>
          </li>
        ))}
      </ul>
      <Button onClick={onJugar}>¡A JUGAR!</Button>
    </div>
  )
}
