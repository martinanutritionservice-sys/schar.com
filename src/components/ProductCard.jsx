// Reutilizado en tres pantallas distintas (desbloqueo, alacena y resumen
// final), cada vez con props distintas: es el ejemplo más claro de
// "un mismo componente, muchos usos" del proyecto.
export default function ProductCard({ producto, bloqueado = false, tamaño = 'grande' }) {
  const tieneFoto = !bloqueado && producto.imagen
  return (
    <div className={`product-card product-card--${tamaño}${bloqueado ? ' product-card--bloqueado' : ''}`}>
      <div className={`product-card__emoji${tieneFoto ? ' product-card__emoji--foto' : ''}`}>
        {bloqueado ? '🔒' : tieneFoto ? <img src={producto.imagen} alt={producto.nombre} /> : producto.emoji}
      </div>
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
