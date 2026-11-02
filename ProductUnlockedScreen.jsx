import Button from '../components/Button.jsx'
import ProductCard from '../components/ProductCard.jsx'

// Misma pantalla, reutilizada una vez por cada producto que se
// desbloquea en el nivel (solo cambian las props que recibe).
export default function ProductUnlockedScreen({ producto, onGuardar }) {
  return (
    <div className="screen">
      <h1 className="section-title">Producto desbloqueado</h1>
      <ProductCard producto={producto} />
      <Button onClick={onGuardar}>GUARDAR EN MI ALACENA</Button>
    </div>
  )
}
