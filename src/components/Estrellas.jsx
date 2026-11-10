// Dificultad en estrellas: llenas (doradas) y vacías (grises), de 4 posibles.
export default function Estrellas({ cantidad, total = 4 }) {
  return (
    <span className="estrellas" role="img" aria-label={`Dificultad ${cantidad} de ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={i < cantidad ? 'estrellas__llena' : 'estrellas__vacia'}>
          ★
        </span>
      ))}
    </span>
  )
}
