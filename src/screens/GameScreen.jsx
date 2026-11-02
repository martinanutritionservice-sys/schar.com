import { useEffect, useState } from 'react'
import { useWordSearch } from '../hooks/useWordSearch.js'
import WordSearchGrid from '../components/WordSearchGrid.jsx'
import WordList from '../components/WordList.jsx'
import LivesIndicator from '../components/LivesIndicator.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import FactOverlay from '../components/FactOverlay.jsx'
import Personaje from '../components/Personaje.jsx'
import Button from '../components/Button.jsx'
import Header from '../components/Header.jsx'
import { sonidoAcierto, sonidoError, sonidoVictoria } from '../utils/sound.js'

const VIDAS_INICIALES = 3
const PISTAS_POR_NIVEL = 3
const DURACION_PISTA_MS = 4500

// TODOS los niveles usan la MISMA grilla de 10 x 10, así el tablero se ve
// siempre igual (mismo tamaño de celdas y de letras) de un nivel al otro.
// Por eso ninguna palabra de levels.js puede tener más de 10 letras.
const TAMAÑO_GRILLA = 10

function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function GameScreen({ nivel, nombreJugador, onNivelCompleto, onVolver }) {
  const listaPalabras = nivel.palabras.map((p) => p.palabra)
  const tamañoGrilla = TAMAÑO_GRILLA
  const {
    grilla,
    ubicaciones,
    estadoCeldas,
    celdaInicio,
    celdaActual,
    iniciarArrastre,
    continuarArrastre,
    finalizarArrastre,
    reiniciar,
  } = useWordSearch(listaPalabras, tamañoGrilla, nivel.dificultad)

  // --- Estado propio de la pantalla de juego (useState + eventos) ---
  const [encontradas, setEncontradas] = useState([])
  const [vidas, setVidas] = useState(VIDAS_INICIALES)
  const [tiempoRestante, setTiempoRestante] = useState(nivel.tiempoSegundos)
  const [palabraEnFoco, setPalabraEnFoco] = useState(null) // {palabra, dato}
  const [estadoNivel, setEstadoNivel] = useState('jugando') // jugando | ganado | perdido
  const [puntaje, setPuntaje] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [pistasRestantes, setPistasRestantes] = useState(PISTAS_POR_NIVEL)
  const [celdaPista, setCeldaPista] = useState(null)

  // GameScreen se desmonta y se vuelve a montar cada vez que se elige un
  // nivel nuevo (ver App.jsx), así que useWordSearch ya arranca con una
  // grilla fresca para ese nivel gracias a su inicializador perezoso.
  // Este efecto solo re-confirma el estado local por las dudas; llamar
  // acá a reiniciar() generaría una SEGUNDA grilla distinta a la que ya
  // se ve en pantalla, dejando una carrera entre lo que el jugador ve y
  // lo que el hook termina validando.
  useEffect(() => {
    setEncontradas([])
    setVidas(VIDAS_INICIALES)
    setTiempoRestante(nivel.tiempoSegundos)
    setPalabraEnFoco(null)
    setEstadoNivel('jugando')
    setPuntaje(0)
    setPistasRestantes(PISTAS_POR_NIVEL)
    setCeldaPista(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivel.id])

  // Cronómetro: comportamiento dinámico que corre solo mientras se juega
  useEffect(() => {
    if (estadoNivel !== 'jugando' || pausado || palabraEnFoco) return undefined
    if (tiempoRestante <= 0) {
      setEstadoNivel('perdido')
      return undefined
    }
    const id = window.setInterval(() => {
      setTiempoRestante((t) => Math.max(0, t - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [estadoNivel, pausado, palabraEnFoco, tiempoRestante])

  // Arrastre estilo "papel": se apoya el dedo/mouse en la primera letra
  // (handleIniciarArrastre), se desliza sobre las siguientes
  // (handleContinuarArrastre, que solo redibuja el camino en pantalla) y
  // recién al soltar se valida si se formó una palabra (handleFinalizarArrastre).
  const puedeJugar = estadoNivel === 'jugando' && !pausado && !palabraEnFoco

  const handleIniciarArrastre = (fila, col) => {
    if (!puedeJugar) return
    iniciarArrastre(fila, col)
  }

  const handleContinuarArrastre = (fila, col) => {
    if (!puedeJugar) return
    continuarArrastre(fila, col)
  }

  const handleFinalizarArrastre = () => {
    if (!puedeJugar) return
    const restantes = listaPalabras.filter((p) => !encontradas.includes(p))

    finalizarArrastre(restantes, ({ acierto, palabra }) => {
      if (acierto) {
        const info = nivel.palabras.find((p) => p.palabra === palabra)
        const nuevasEncontradas = [...encontradas, palabra]
        setEncontradas(nuevasEncontradas)
        setPuntaje((p) => p + 100)
        setPalabraEnFoco({ palabra, dato: info?.dato ?? '' })
        if (nuevasEncontradas.length === listaPalabras.length) {
          sonidoVictoria()
        } else {
          sonidoAcierto()
        }
      } else {
        setVidas((v) => Math.max(0, v - 1))
        sonidoError()
      }
    })
  }

  useEffect(() => {
    if (vidas === 0 && estadoNivel === 'jugando') setEstadoNivel('perdido')
  }, [vidas, estadoNivel])

  const cerrarOverlay = () => {
    setPalabraEnFoco(null)
    if (encontradas.length === listaPalabras.length) {
      onNivelCompleto(nivel.id, { puntaje: puntaje, tiempoUsado: nivel.tiempoSegundos - tiempoRestante })
    }
  }

  // Pista: marca con un aro que late la PRIMERA letra de una palabra que
  // todavía no se encontró. No resuelve la palabra, solo dice dónde empezar.
  const usarPista = () => {
    if (!puedeJugar || pistasRestantes === 0) return
    const pendientes = listaPalabras.filter((p) => !encontradas.includes(p))
    if (pendientes.length === 0) return
    const elegida = pendientes[Math.floor(Math.random() * pendientes.length)]
    const inicio = ubicaciones[elegida]?.[0]
    if (!inicio) return
    setPistasRestantes((p) => p - 1)
    setCeldaPista(inicio)
    window.setTimeout(() => setCeldaPista(null), DURACION_PISTA_MS)
  }

  const reintentar = () => {
    setEncontradas([])
    setVidas(VIDAS_INICIALES)
    setTiempoRestante(nivel.tiempoSegundos)
    setEstadoNivel('jugando')
    setPuntaje(0)
    setPistasRestantes(PISTAS_POR_NIVEL)
    setCeldaPista(null)
    reiniciar()
  }

  if (estadoNivel === 'perdido') {
    return (
      <div className="screen screen--centrado">
        <Personaje nombre="padre" tamaño="grande" />
        <h1 className="section-title">¡Casi, {nombreJugador || 'CRACK'}!</h1>
        <p>
          {vidas === 0
            ? 'Te quedaste sin vidas en este nivel.'
            : 'Se acabó el tiempo para este nivel.'}
        </p>
        <p className="game-over__detalle">
          Encontraste {encontradas.length} de {listaPalabras.length} palabras.
        </p>
        <Button onClick={reintentar}>REINTENTAR</Button>
        <Button variant="ghost" onClick={onVolver}>
          VOLVER A NIVELES
        </Button>
      </div>
    )
  }

  // "Un poco de interacción" en el tiempo: cuando queda poco (20% o
  // menos, con un piso de 10s), el reloj y su barra se ponen rojos y
  // laten, para que se sienta la presión igual que en un juego de mesa.
  const umbralUrgente = Math.max(10, Math.round(nivel.tiempoSegundos * 0.2))
  const tiempoUrgente = tiempoRestante <= umbralUrgente
  const porcentajeTiempo = Math.max(0, Math.min(100, (tiempoRestante / nivel.tiempoSegundos) * 100))

  return (
    <div className="screen screen--juego">
      <Header
        left={
          <button className="app-header__back" onClick={() => setPausado((p) => !p)} type="button" aria-label={pausado ? 'Continuar' : 'Pausar'}>
            {pausado ? '▶' : '⏸'}
          </button>
        }
        right={
          <>
            <span className={`game-timer${tiempoUrgente ? ' game-timer--urgente' : ''}`}>
              {formatearTiempo(tiempoRestante)}
            </span>
            <LivesIndicator vidas={vidas} />
          </>
        }
      />

      <div className="timer-bar" role="presentation">
        <div
          className={`timer-bar__relleno${tiempoUrgente ? ' timer-bar__relleno--urgente' : ''}`}
          style={{ width: `${porcentajeTiempo}%` }}
        />
      </div>

      <h2 className="game__nivel-titulo">
        NIVEL {nivel.id}
        <br />
        <span>{nivel.titulo}</span>
      </h2>

      {pausado ? (
        <div className="screen--centrado">
          <p>Juego en pausa.</p>
          <Button onClick={() => setPausado(false)}>CONTINUAR</Button>
        </div>
      ) : (
        <>
          <WordSearchGrid
            grilla={grilla}
            estadoCeldas={estadoCeldas}
            celdaInicio={celdaInicio}
            celdaActual={celdaActual}
            celdaPista={celdaPista}
            onIniciarArrastre={handleIniciarArrastre}
            onContinuarArrastre={handleContinuarArrastre}
            onFinalizarArrastre={handleFinalizarArrastre}
          />

          <div className="game__lista-wrapper">
            <p className="game__lista-titulo">Palabras a encontrar</p>
            <WordList palabras={nivel.palabras} encontradas={encontradas} />
          </div>

          <p className="game__progreso-texto">
            {encontradas.length} / {listaPalabras.length} palabras encontradas
          </p>
          <ProgressBar value={encontradas.length} max={listaPalabras.length} />

          <button
            type="button"
            className="btn-pista"
            onClick={usarPista}
            disabled={pistasRestantes === 0}
          >
            💡 PISTA ({pistasRestantes})
          </button>
        </>
      )}

      {palabraEnFoco && (
        <FactOverlay palabra={palabraEnFoco.palabra} dato={palabraEnFoco.dato} nivelId={nivel.id} onContinuar={cerrarOverlay} />
      )}
    </div>
  )
}
