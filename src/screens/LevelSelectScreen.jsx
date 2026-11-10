import Header from '../components/Header.jsx'
import Estrellas from '../components/Estrellas.jsx'

export default function LevelSelectScreen({ niveles, nivelesCompletados, onSelectNivel, onVolver }) {
  const estaDesbloqueado = (nivel, index) => index === 0 || nivelesCompletados.includes(niveles[index - 1].id)

  return (
    <div className="screen">
      <Header onBack={onVolver} title="ELEGÍ TU NIVEL" />
      <ul className="level-list">
        {niveles.map((nivel, index) => {
          const desbloqueado = estaDesbloqueado(nivel, index)
          const completado = nivelesCompletados.includes(nivel.id)
          return (
            <li key={nivel.id}>
              <button
                type="button"
                className="level-list__item"
                disabled={!desbloqueado}
                onClick={() => desbloqueado && onSelectNivel(nivel.id)}
              >
                <span className={`level-list__numero${completado ? ' level-list__numero--ok' : ''}`}>
                  {completado ? '✓' : nivel.id}
                </span>
                <span className="level-list__texto">
                  <span className="level-list__titulo">{nivel.titulo}</span>
                  <span className="level-list__meta">
                    <Estrellas cantidad={nivel.estrellas} /> {nivel.etiqueta} · {nivel.cantidad} palabras
                  </span>
                </span>
                {!desbloqueado && <span className="level-list__candado">🔒</span>}
                {desbloqueado && <span className="level-list__flecha">›</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
