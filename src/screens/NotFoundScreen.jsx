import Button from '../components/Button.jsx'
import Personaje from '../components/Personaje.jsx'

// Se muestra cuando la dirección no existe (ruta "*" del router).
export default function NotFoundScreen({ onVolver }) {
  return (
    <div className="screen screen--centrado">
      <Personaje nombre="gluten" tamaño="grande" />
      <h1 className="section-title">¡Ups! Esta página se escondió</h1>
      <p>Como las palabras de la sopa de letras, no la pudimos encontrar.</p>
      <Button onClick={onVolver}>VOLVER AL COMIENZO</Button>
    </div>
  )
}
