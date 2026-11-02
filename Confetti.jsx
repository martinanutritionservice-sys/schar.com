const COLORES = ['var(--schar-red)', 'var(--schar-yellow)', 'var(--green)', 'var(--dark)']
const PIEZAS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  izquierda: Math.round(Math.random() * 100),
  demora: (Math.random() * 0.4).toFixed(2),
  duracion: (1.1 + Math.random() * 0.6).toFixed(2),
  color: COLORES[i % COLORES.length],
  rotacion: Math.round(Math.random() * 360),
}))

// Lluvia de confeti puramente decorativa (CSS), para darle un festejo
// "cool" a las pantallas de victoria sin depender de ninguna librería.
export default function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {PIEZAS.map((p) => (
        <span
          key={p.id}
          className="confetti__pieza"
          style={{
            left: `${p.izquierda}%`,
            animationDelay: `${p.demora}s`,
            animationDuration: `${p.duracion}s`,
            background: p.color,
            transform: `rotate(${p.rotacion}deg)`,
          }}
        />
      ))}
    </div>
  )
}
