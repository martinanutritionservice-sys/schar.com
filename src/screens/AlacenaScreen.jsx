import { useState } from 'react'
import { PRODUCTOS } from '../data/levels.js'
import ProductCard from '../components/ProductCard.jsx'
import ProductZoom from '../components/ProductZoom.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const FILTROS = [
  { id: 'todos', texto: 'Todos' },
  { id: 'dulce', texto: '🍪 Dulces' },
  { id: 'salado', texto: '🥨 Salados' },
]

export default function AlacenaScreen({ productosDesbloqueados, onVolver }) {
  const [filtro, setFiltro] = useState('todos')
  const [ampliado, setAmpliado] = useState(null)

  const visibles = PRODUCTOS.filter((p) => filtro === 'todos' || p.tipo === filtro)
  const cuantosTengo = (tipo) => PRODUCTOS.filter((p) => p.tipo === tipo && productosDesbloqueados.includes(p.id)).length
  const cuantosHay = (tipo) => PRODUCTOS.filter((p) => p.tipo === tipo).length

  return (
    <div className="screen">
      <Header onBack={onVolver} title="MI ALACENA SCHÄR" />
      <p className="alacena__contador">
        {productosDesbloqueados.length} de {PRODUCTOS.length} productos encontrados
      </p>
      <p className="alacena__desglose">
        🍪 {cuantosTengo('dulce')}/{cuantosHay('dulce')} dulces · 🥨 {cuantosTengo('salado')}/{cuantosHay('salado')} salados
      </p>
      <div className="alacena__filtros" role="tablist" aria-label="Filtrar productos">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filtro === f.id}
            className={`chip${filtro === f.id ? ' chip--activo' : ''}`}
            onClick={() => setFiltro(f.id)}
          >
            {f.texto}
          </button>
        ))}
      </div>
      <div className="alacena__grid">
        {visibles.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            bloqueado={!productosDesbloqueados.includes(producto.id)}
            tamaño="chico"
            onAmpliar={setAmpliado}
          />
        ))}
      </div>
      <Footer>Tocá un producto para verlo en grande. Se suman a medida que completás niveles.</Footer>
      {ampliado && <ProductZoom producto={ampliado} onCerrar={() => setAmpliado(null)} />}
    </div>
  )
}
