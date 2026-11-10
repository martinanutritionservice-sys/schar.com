import { useState } from 'react'
import Button from '../components/Button.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductZoom from '../components/ProductZoom.jsx'

// Misma pantalla, reutilizada una vez por cada producto que se
// desbloquea en el nivel (solo cambian las props que recibe).
export default function ProductUnlockedScreen({ producto, esDeTuGusto, onGuardar }) {
  const [ampliado, setAmpliado] = useState(null)
  return (
    <div className="screen">
      <h1 className="section-title">Producto desbloqueado</h1>
      {esDeTuGusto && <p className="producto__gusto">💛 Es de tu gusto: ¡te lo ganaste primero!</p>}
      <ProductCard producto={producto} onAmpliar={setAmpliado} />
      <p className="producto__ayuda">Tocá la foto para verlo en grande</p>
      <Button onClick={onGuardar}>GUARDAR EN MI ALACENA</Button>
      {ampliado && <ProductZoom producto={ampliado} onCerrar={() => setAmpliado(null)} />}
    </div>
  )
}
