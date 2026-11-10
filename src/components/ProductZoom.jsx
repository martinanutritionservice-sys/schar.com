import Button from './Button.jsx'

// Zoom de producto: al tocar un producto de la alacena (o del premio) se
// abre este panel con el packaging en grande, el tipo (dulce / salado) y la
// descripción. Se cierra tocando afuera, en la X o en el botón.
export default function ProductZoom({ producto, onCerrar }) {
  return (
    <div className="overlay overlay--zoom" role="dialog" aria-label={`Zoom de ${producto.nombre}`} onClick={onCerrar}>
      <div className="zoom-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="zoom-card__cerrar" onClick={onCerrar} aria-label="Cerrar zoom">
          ✕
        </button>
        <div className="zoom-card__foto">
          {producto.imagen ? <img src={producto.imagen} alt={producto.nombre} /> : <span>{producto.emoji}</span>}
        </div>
        <span className={`tipo-badge tipo-badge--${producto.tipo}`}>
          {producto.tipo === 'dulce' ? '🍪 Dulce' : '🥨 Salado'}
        </span>
        <h2 className="zoom-card__nombre">{producto.nombre}</h2>
        <p className="zoom-card__descripcion">{producto.descripcion}</p>
        <div className="product-card__usos">
          {producto.usos.map((uso) => (
            <span key={uso} className="product-card__uso-tag">
              {uso}
            </span>
          ))}
        </div>
        <Button onClick={onCerrar}>CERRAR</Button>
      </div>
    </div>
  )
}
