import { useState } from 'react'
import Button from '../components/Button.jsx'
import { sonidoClick } from '../utils/sound.js'

// Pantalla de "registro" antes de arrancar: solo pide el nombre, para
// poder personalizar el resto del juego (saludo, victoria, derrota,
// pantalla final) con quién lo está jugando.
export default function NameScreen({ onContinuar }) {
  const [nombre, setNombre] = useState('')

  const confirmar = () => {
    const limpio = nombre.trim()
    if (!limpio) return
    sonidoClick()
    onContinuar(limpio)
  }

  return (
    <div className="screen screen--centrado screen--nombre">
      <span className="nombre-form__icono">🙋</span>
      <h1 className="section-title">¿CÓMO TE LLAMÁS?</h1>
      <p>Así podemos festejar tus logros con tu nombre.</p>
      <input
        type="text"
        className="nombre-form__input"
        placeholder="Escribí tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirmar()
        }}
        maxLength={20}
        autoFocus
      />
      <Button onClick={confirmar} disabled={!nombre.trim()}>
        CONTINUAR
      </Button>
    </div>
  )
}
