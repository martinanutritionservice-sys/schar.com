import { PREFERENCIAS } from '../data/levels.js'
import Header from '../components/Header.jsx'

const OPCIONES = ['dulce', 'salado', 'ambos']

// Personalización del juego: ¿sos más dulce o más salado? La respuesta decide
// qué productos Schär se desbloquean primero y cómo se arma tu alacena.
export default function PreferenceScreen({ nombreJugador, actual, onElegir, onVolver }) {
  return (
    <div className="screen">
      {onVolver && <Header onBack={onVolver} />}
      <h1 className="section-title">{nombreJugador ? `${nombreJugador}, ` : ''}¿dulce o salado?</h1>
      <p className="pref__texto">Elegí tu gusto y vamos a desbloquear primero los productos que más te tientan.</p>
      <div className="pref__opciones">
        {OPCIONES.map((id) => {
          const p = PREFERENCIAS[id]
          return (
            <button
              key={id}
              type="button"
              className={`pref__opcion glass${actual === id ? ' pref__opcion--activa' : ''}`}
              onClick={() => onElegir(id)}
            >
              <span className="pref__emoji" aria-hidden="true">{p.emoji}</span>
              <span className="pref__titulo">{p.titulo}</span>
              <span className="pref__detalle">
                {id === 'dulce' && 'Cookies, wafers, chocolate…'}
                {id === 'salado' && 'Panes, crackers, snacks…'}
                {id === 'ambos' && 'Un poco de cada uno'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
