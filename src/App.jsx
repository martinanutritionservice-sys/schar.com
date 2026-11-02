import { useEffect, useState } from 'react'
import { NIVELES, getNivelPorId, getProductoPorId } from './data/levels.js'
import { useEscalaPantalla } from './hooks/useEscalaPantalla.js'
import { cargarProgreso, guardarProgreso, borrarProgreso } from './utils/progreso.js'

import SplashScreen from './screens/SplashScreen.jsx'
import NameScreen from './screens/NameScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import HowToPlayScreen from './screens/HowToPlayScreen.jsx'
import LevelSelectScreen from './screens/LevelSelectScreen.jsx'
import LevelIntroScreen from './screens/LevelIntroScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import LevelCompleteScreen from './screens/LevelCompleteScreen.jsx'
import PrizeScreen from './screens/PrizeScreen.jsx'
import ProductUnlockedScreen from './screens/ProductUnlockedScreen.jsx'
import AlacenaScreen from './screens/AlacenaScreen.jsx'
import FinalScreen from './screens/FinalScreen.jsx'
import Button from './components/Button.jsx'

// App.jsx es el "controlador" de la navegación: guarda en qué pantalla
// estamos y el progreso del jugador, y se lo pasa a cada pantalla por
// props junto con las funciones para avanzar. Las pantallas no saben
// nada entre sí, solo reciben datos y callbacks.
export default function App() {
  const escala = useEscalaPantalla()
  const [pantalla, setPantalla] = useState('splash')
  const [nivelActualId, setNivelActualId] = useState(null)
  // El progreso guardado en el navegador (si hay) se lee una sola vez, al abrir.
  const [guardado] = useState(cargarProgreso)
  const [nombreJugador, setNombreJugador] = useState(guardado.nombreJugador)

  const [nivelesCompletados, setNivelesCompletados] = useState(guardado.nivelesCompletados)
  const [productosDesbloqueados, setProductosDesbloqueados] = useState(guardado.productosDesbloqueados)
  const [palabrasEncontradasTotal, setPalabrasEncontradasTotal] = useState(guardado.palabrasEncontradasTotal)
  const [puntajeTotal, setPuntajeTotal] = useState(guardado.puntajeTotal)

  const [colaProductos, setColaProductos] = useState([])
  const [juegoTerminado, setJuegoTerminado] = useState(guardado.nivelesCompletados.length === NIVELES.length)
  const [confirmarSalida, setConfirmarSalida] = useState(false)

  // Cada vez que cambia el progreso, se guarda en el navegador.
  useEffect(() => {
    guardarProgreso({ nombreJugador, nivelesCompletados, productosDesbloqueados, palabrasEncontradasTotal, puntajeTotal })
  }, [nombreJugador, nivelesCompletados, productosDesbloqueados, palabrasEncontradasTotal, puntajeTotal])

  const nivelActual = nivelActualId ? getNivelPorId(nivelActualId) : null

  const irA = (pantallaDestino) => setPantalla(pantallaDestino)

  // Botón "Inicio": aparece en todas las secciones salvo la bienvenida, el
  // registro, el inicio mismo y el tramo del premio (nivel completo ->
  // premio -> producto), porque ahí hay un producto por guardar y salir
  // a la mitad lo haría perder. Ese tramo termina siempre en una pantalla
  // que sí tiene el botón.
  const PANTALLAS_CON_INICIO = ['howto', 'levels', 'levelIntro', 'game', 'alacena', 'final']
  const mostrarInicio = PANTALLAS_CON_INICIO.includes(pantalla)

  const handleInicio = () => {
    // En pleno juego se pregunta antes: salir hace perder el avance del nivel.
    if (pantalla === 'game') {
      setConfirmarSalida(true)
      return
    }
    irA('home')
  }

  const confirmarIrAInicio = () => {
    setConfirmarSalida(false)
    irA('home')
  }

  const handleSeleccionarNivel = (id) => {
    setNivelActualId(id)
    irA('levelIntro')
  }

  const handleNivelCompleto = (nivelId, resultado) => {
    const nivel = getNivelPorId(nivelId)
    const yaEstaba = nivelesCompletados.includes(nivelId)
    const nuevosCompletados = yaEstaba ? nivelesCompletados : [...nivelesCompletados, nivelId]

    setNivelesCompletados(nuevosCompletados)
    setPuntajeTotal((p) => p + resultado.puntaje)
    if (!yaEstaba) setPalabrasEncontradasTotal((p) => p + nivel.palabras.length)

    setJuegoTerminado(nuevosCompletados.length === NIVELES.length)
    setColaProductos(yaEstaba ? [] : nivel.productosIds)
    irA('levelComplete')
  }

  const handleVerPremio = () => {
    if (colaProductos.length === 0) {
      irA(juegoTerminado ? 'final' : 'levels')
      return
    }
    irA('prize')
  }

  const handleGuardarEnAlacena = () => {
    const [actual, ...resto] = colaProductos
    setProductosDesbloqueados((prev) => (prev.includes(actual) ? prev : [...prev, actual]))
    setColaProductos(resto)
    if (resto.length > 0) {
      irA('prize')
    } else {
      irA(juegoTerminado ? 'final' : 'levels')
    }
  }

  // "¿No sos vos?": borra el progreso guardado y vuelve al registro.
  const cambiarJugador = () => {
    borrarProgreso()
    setNombreJugador('')
    setNivelesCompletados([])
    setProductosDesbloqueados([])
    setPalabrasEncontradasTotal(0)
    setPuntajeTotal(0)
    setColaProductos([])
    setJuegoTerminado(false)
    setNivelActualId(null)
    irA('nombre')
  }

  const reiniciarJuego = () => {
    setNivelesCompletados([])
    setProductosDesbloqueados([])
    setPalabrasEncontradasTotal(0)
    setPuntajeTotal(0)
    setColaProductos([])
    setJuegoTerminado(false)
    setNivelActualId(null)
    irA('home')
  }

  return (
    <div className="phone-frame" style={{ transform: `scale(${escala})` }}>
      <div className={`phone-screen${mostrarInicio ? ' phone-screen--con-inicio' : ''}`}>
        {pantalla === 'splash' && <SplashScreen onComenzar={() => irA(nombreJugador ? 'home' : 'nombre')} />}

        {pantalla === 'nombre' && (
          <NameScreen
            onContinuar={(nombre) => {
              setNombreJugador(nombre)
              irA('home')
            }}
          />
        )}

        {pantalla === 'home' && (
          <HomeScreen
            nombreJugador={nombreJugador}
            onJugar={() => irA('levels')}
            onAlacena={() => irA('alacena')}
            onComoJugar={() => irA('howto')}
            onCambiarJugador={cambiarJugador}
          />
        )}

        {pantalla === 'howto' && <HowToPlayScreen onVolver={() => irA('home')} onJugar={() => irA('levels')} />}

        {pantalla === 'levels' && (
          <LevelSelectScreen
            niveles={NIVELES}
            nivelesCompletados={nivelesCompletados}
            onSelectNivel={handleSeleccionarNivel}
            onVolver={() => irA('home')}
          />
        )}

        {pantalla === 'levelIntro' && nivelActual && (
          <LevelIntroScreen nivel={nivelActual} onComenzar={() => irA('game')} onVolver={() => irA('levels')} />
        )}

        {pantalla === 'game' && nivelActual && (
          <GameScreen
            nivel={nivelActual}
            nombreJugador={nombreJugador}
            onNivelCompleto={handleNivelCompleto}
            onVolver={() => irA('levels')}
          />
        )}

        {pantalla === 'levelComplete' && (
          <LevelCompleteScreen nombreJugador={nombreJugador} onVerPremio={handleVerPremio} />
        )}

        {pantalla === 'prize' && colaProductos[0] && (
          <PrizeScreen producto={getProductoPorId(colaProductos[0])} onSumarAlacena={() => irA('productDetail')} />
        )}

        {pantalla === 'productDetail' && colaProductos[0] && (
          <ProductUnlockedScreen producto={getProductoPorId(colaProductos[0])} onGuardar={handleGuardarEnAlacena} />
        )}

        {pantalla === 'alacena' && (
          <AlacenaScreen
            productosDesbloqueados={productosDesbloqueados}
            onVolver={() => irA(juegoTerminado || nivelesCompletados.length > 0 ? 'home' : 'home')}
          />
        )}

        {pantalla === 'final' && (
          <FinalScreen
            nombreJugador={nombreJugador}
            nivelesCompletados={nivelesCompletados}
            productosDesbloqueados={productosDesbloqueados}
            palabrasEncontradasTotal={palabrasEncontradasTotal}
            puntajeTotal={puntajeTotal}
            onAlacena={() => irA('alacena')}
            onVolverAJugar={reiniciarJuego}
          />
        )}
      </div>

      {mostrarInicio && (
        <button type="button" className="home-fab" onClick={handleInicio} aria-label="Volver a la página principal">
          <span aria-hidden="true">🏠</span> INICIO
        </button>
      )}

      {confirmarSalida && (
        <div className="overlay" role="dialog" aria-label="Salir al inicio">
          <div className="overlay__card">
            <h2 className="overlay__palabra">¿Salir al inicio?</h2>
            <p className="overlay__dato">Si salís ahora, perdés el avance de este nivel.</p>
            <Button onClick={() => setConfirmarSalida(false)}>SEGUIR JUGANDO</Button>
            <Button variant="ghost" onClick={confirmarIrAInicio}>SALIR AL INICIO</Button>
          </div>
        </div>
      )}
    </div>
  )
}
