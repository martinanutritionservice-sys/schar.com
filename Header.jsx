// Header reutilizable: aparece en casi todas las pantallas (home, niveles,
// juego, alacena, cómo jugar) con distintas combinaciones de props —
// a veces con botón de volver, a veces con título, a veces con contenido
// a la derecha (vidas, cronómetro, íconos).
export default function Header({ onBack, left, title, right, center = false }) {
  const hayContenido = onBack || left || title || right
  if (!hayContenido) return null

  return (
    <header className={`app-header${center ? ' app-header--center' : ''}`}>
      {left ? (
        left
      ) : onBack ? (
        <button className="app-header__back" onClick={onBack} type="button" aria-label="Volver">
          ←
        </button>
      ) : (
        <span className="app-header__spacer" />
      )}
      {title && <h1 className="app-header__titulo">{title}</h1>}
      <span className="app-header__right">{right}</span>
    </header>
  )
}
