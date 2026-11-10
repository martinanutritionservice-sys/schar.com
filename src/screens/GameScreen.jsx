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
import Estrellas from '../components/Estrellas.jsx'
import { elegirPalabras } from '../data/levels.js'
import { mensajeDerrota, mensajeVictoria, elogioPalabra } from '../data/mensajes.js'
import { sonidoAcierto, sonidoError, sonidoVictoria } from '../utils/sound.js'

const PUNTOS_POR_PALABRA = 100
const PUNTOS_POR_VIDA = 20
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

// GameScreen solo guarda el "número de intento". Cada intento monta una
// Partida nueva (key={intento}), que sortea palabras nuevas del banco del
// nivel y arma un tablero nuevo: nunca se juega dos veces el mismo.
export default function GameScreen(props) {
  const [intento, setIntento] = useState(0)
  return <Partida key={intento} {...props} onReintentar={() => setIntento((i) => i + 1)} />
}

function Partida({ nivel, nombreJugador, onNivelCompleto, onVolver, onReintentar }) {
  // Se sortea UNA vez al montar la partida.
  const [palabrasNivel] = useState(() => elegirPalabras(nivel))
  const listaPalabras = palabrasNivel.map((p) => p.palabra)
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
  } = useWordSearch(listaPalabras, tamañoGrilla, nivel.dificultad)

  // --- Estado propio de la pantalla de juego (useState + eventos) ---
  const [encontradas, setEncontradas] = useState([])
  const [vidas, setVidas] = useState(nivel.vidas)
  const [errores, setErrores] = useState(0)
  const [tiempoRestante, setTiempoRestante] = useState(nivel.tiempoSegundos)
  const [palabraEnFoco, setPalabraEnFoco] = useState(null) // {palabra, dato, elogio}
  const [estadoNivel, setEstadoNivel] = useState('jugando') // jugando | ganado | perdido
  const [puntaje, setPuntaje] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [pistasRestantes, setPistasRestantes] = useState(nivel.pistas)
  const [celdaPista, setCeldaPista] = useState(null)

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
        const info = palabrasNivel.find((p) => p.palabra === palabra)
        const nuevasEncontradas = [...encontradas, palabra]
        setEncontradas(nuevasEncontradas)
        setPuntaje((p) => p + PUNTOS_POR_PALABRA)
        setPalabraEnFoco({ palabra, dato: info?.dato ?? '', elogio: elogioPalabra() })
        if (nuevasEncontradas.length === listaPalabras.length) {
          sonidoVictoria()
        } else {
          sonidoAcierto()
        }
      } else {
        setVidas((v) => Math.max(0, v - 1))
        setErrores((e) => e + 1)
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
      // Bonus por vidas que te sobraron: premia jugar con cuidado.
      const bonus = vidas * PUNTOS_POR_VIDA
      const perfecta = errores === 0
      onNivelCompleto(nivel, {
        puntaje: puntaje + bonus,
        bonus,
        errores,
        perfecta,
        tiempoUsado: nivel.tiempoSegundos - tiempoRestante,
        mensaje: mensajeVictoria(nombreJugador, perfecta),
      })
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

  if (estadoNivel === 'perdido') {
    return (
      <PantallaDerrota
        nombreJugador={nombreJugador}
        motivo={vidas === 0 ? 'vidas' : 'tiempo'}
        encontradas={encontradas.length}
        total={listaPalabras.length}
        onReintentar={onReintentar}
        onVolver={onVolver}
      />
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
            <LivesIndicator vidas={vidas} vidasMax={nivel.vidas} />
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
      <p className="game__dificultad">
        <Estrellas cantidad={nivel.estrellas} /> {nivel.etiqueta}
      </p>

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
            <WordList palabras={palabrasNivel} encontradas={encontradas} />
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
            💡 {nivel.pistas === 0 ? 'SIN PISTAS' : `PISTA (${pistasRestantes})`}
          </button>
        </>
      )}

      {palabraEnFoco && (
        <FactOverlay titulo={palabraEnFoco.elogio} palabra={palabraEnFoco.palabra} dato={palabraEnFoco.dato} nivelId={nivel.id} onContinuar={cerrarOverlay} />
      )}
    </div>
  )
}

// Pantalla de derrota: mensaje distinto según el motivo (sin vidas o sin
// tiempo) y sorteado al azar, con el nombre de la persona.
function PantallaDerrota({ nombreJugador, motivo, encontradas, total, onReintentar, onVolver }) {
  const [mensaje] = useState(() => mensajeDerrota(nombreJugador, motivo))
  return (
    <div className="screen screen--centrado">
      <Personaje nombre="padre" tamaño="grande" />
      <h1 className="section-title">{motivo === 'vidas' ? '¡Sin vidas!' : '¡Se acabó el tiempo!'}</h1>
      <p>{mensaje}</p>
      <p className="game-over__detalle">
        Encontraste {encontradas} de {total} palabras.
      </p>
      <Button onClick={onReintentar}>REINTENTAR CON PALABRAS NUEVAS</Button>
      <Button variant="ghost" onClick={onVolver}>
        VOLVER A NIVELES
      </Button>
    </div>
  )
}
