import { useState } from 'react'
import Button from '../components/Button.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { PREFERENCIAS } from '../data/levels.js'
import { getSonidoActivo, setSonidoActivo, sonidoClick } from '../utils/sound.js'

export default function HomeScreen({ nombreJugador, preferencia, onJugar, onAlacena, onComoJugar, onCambiarGusto, onCambiarJugador }) {
  // Estado propio de esta pantalla: si el sonido del juego está activo.
  // Arranca leyendo lo que ya se había guardado (o true por defecto).
  const [sonidoOn, setSonidoOn] = useState(getSonidoActivo)

  const toggleSonido = () => {
    const nuevoValor = !sonidoOn
    setSonidoActivo(nuevoValor)
    setSonidoOn(nuevoValor)
    if (nuevoValor) sonidoClick()
  }

  return (
    <div className="screen">
      <Header
        right={
          <>
            <button
              className="icon-button"
              onClick={toggleSonido}
              type="button"
              aria-label={sonidoOn ? 'Silenciar sonido' : 'Activar sonido'}
              title={sonidoOn ? 'Silenciar sonido' : 'Activar sonido'}
            >
              {sonidoOn ? '🔊' : '🔇'}
            </button>
            <span
              className={`icon-button icon-button--estatico${nombreJugador ? ' icon-button--avatar' : ''}`}
              title={nombreJugador || undefined}
            >
              {nombreJugador ? nombreJugador[0].toUpperCase() : '👤'}
            </span>
          </>
        }
      />
      <h1 className="home__saludo">¡HOLA{nombreJugador ? `, ${nombreJugador.toUpperCase()}` : ''}!</h1>
      <p className="home__pregunta">
        ¿LISTO PARA TU
        <br />
        <strong>MISIÓN SIN GLUTEN</strong>?
      </p>
      <div className="home__acciones">
        <Button onClick={onJugar}>JUGAR</Button>
        <Button onClick={onAlacena} variant="secondary">
          MI ALACENA
        </Button>
        <Button onClick={onComoJugar} variant="ghost">
          ¿CÓMO JUGAR? ❓
        </Button>
      </div>
      {preferencia && (
        <button type="button" className="home__gusto glass" onClick={onCambiarGusto}>
          {PREFERENCIAS[preferencia].emoji} {PREFERENCIAS[preferencia].frase} · cambiar
        </button>
      )}
      {nombreJugador && (
        <button type="button" className="home__cambiar" onClick={onCambiarJugador}>
          ¿No sos {nombreJugador}? Empezar de nuevo
        </button>
      )}
      <Footer>Aprendé sobre celiaquía mientras te divertís. 🤍</Footer>
    </div>
  )
}
