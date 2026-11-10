// Reutilizado en tres pantallas distintas (desbloqueo, alacena y resumen
// final), cada vez con props distintas: es el ejemplo más claro de
// "un mismo componente, muchos usos" del proyecto.
// Si recibe `onAmpliar`, la foto se puede tocar para verla en grande (zoom).
export default function ProductCard({ producto, bloqueado = false, tamaño = 'grande', onAmpliar }) {
  const tieneFoto = !bloqueado && producto.imagen
  const contenido = bloqueado ? '🔒' : tieneFoto ? <img src={producto.imagen} alt={producto.nombre} /> : producto.emoji
  const claseFoto = `product-card__emoji${tieneFoto ? ' product-card__emoji--foto' : ''}`

  return (
    <div className={`product-card product-card--${tamaño}${bloqueado ? ' product-card--bloqueado' : ''}`}>
      {onAmpliar && !bloqueado ? (
        <button
          type="button"
          className={`${claseFoto} product-card__zoom`}
          onClick={() => onAmpliar(producto)}
          aria-label={`Ver ${producto.nombre} en grande`}
        >
          {contenido}
          <span className="product-card__lupa" aria-hidden="true">🔍</span>
        </button>
      ) : (
        <div className={claseFoto}>{contenido}</div>
      )}
      {!bloqueado && (
        <span className={`tipo-badge tipo-badge--${producto.tipo}${tamaño === 'chico' ? ' tipo-badge--chico' : ''}`}>
          {producto.tipo === 'dulce' ? '🍪 Dulce' : '🥨 Salado'}
        </span>
      )}
      {tamaño === 'chico' && !bloqueado && (
        <p className="product-card__nombre-chico">{producto.nombre}</p>
      )}
      {tamaño === 'grande' && !bloqueado && (
        <>
          <h3 className="product-card__nombre">{producto.nombre}</h3>
          <p className="product-card__descripcion">{producto.descripcion}</p>
          <div className="product-card__usos">
            {producto.usos.map((uso) => (
              <span key={uso} className="product-card__uso-tag">
                {uso}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
