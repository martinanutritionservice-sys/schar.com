import { PRODUCTOS } from '../data/levels.js'
import ProductCard from '../components/ProductCard.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function AlacenaScreen({ productosDesbloqueados, onVolver }) {
  return (
    <div className="screen">
      <Header onBack={onVolver} title="MI ALACENA SCHÄR" />
      <p className="alacena__contador">
        {productosDesbloqueados.length} de {PRODUCTOS.length} productos encontrados
      </p>
      <div className="alacena__grid">
        {PRODUCTOS.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            bloqueado={!productosDesbloqueados.includes(producto.id)}
            tamaño="chico"
          />
        ))}
      </div>
      <Footer>Los productos se van sumando a medida que completás niveles.</Footer>
    </div>
  )
}
