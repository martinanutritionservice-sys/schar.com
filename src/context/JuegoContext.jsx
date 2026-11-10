import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NIVELES, elegirPremios } from '../data/levels.js'
import { cargarProgreso, guardarProgreso, borrarProgreso } from '../utils/progreso.js'

// Estado global del juego (jugador, preferencia, niveles, alacena, puntaje).
// Vive en un Context para que cualquier pantalla del router pueda leerlo sin
// pasar props por todos lados; las pantallas reciben solo lo que necesitan.
const JuegoContext = createContext(null)

export function JuegoProvider({ children }) {
  const [guardado] = useState(cargarProgreso)
  const [nombreJugador, setNombreJugador] = useState(guardado.nombreJugador)
  const [preferencia, setPreferencia] = useState(guardado.preferencia)
  const [nivelesCompletados, setNivelesCompletados] = useState(guardado.nivelesCompletados)
  const [productosDesbloqueados, setProductosDesbloqueados] = useState(guardado.productosDesbloqueados)
  const [colaProductos, setColaProductos] = useState(guardado.colaProductos)
  const [palabrasEncontradasTotal, setPalabrasEncontradasTotal] = useState(guardado.palabrasEncontradasTotal)
  const [puntajeTotal, setPuntajeTotal] = useState(guardado.puntajeTotal)
  // Resultado del último nivel jugado (para la pantalla de "misión cumplida").
  const [ultimoResultado, setUltimoResultado] = useState(null)

  useEffect(() => {
    guardarProgreso({
      nombreJugador,
      preferencia,
      nivelesCompletados,
      productosDesbloqueados,
      colaProductos,
      palabrasEncontradasTotal,
      puntajeTotal,
    })
  }, [nombreJugador, preferencia, nivelesCompletados, productosDesbloqueados, colaProductos, palabrasEncontradasTotal, puntajeTotal])

  const juegoTerminado = nivelesCompletados.length === NIVELES.length

  const completarNivel = useCallback(
    (nivel, resultado) => {
      const yaEstaba = nivelesCompletados.includes(nivel.id)
      if (!yaEstaba) {
        setNivelesCompletados([...nivelesCompletados, nivel.id])
        setPalabrasEncontradasTotal((p) => p + nivel.cantidad)
        // Los premios se eligen según tu gusto (dulce / salado), sin repetir
        // los que ya tenés ni los que están esperando para guardarse.
        setColaProductos(elegirPremios(preferencia, [...productosDesbloqueados, ...colaProductos]))
      }
      setPuntajeTotal((p) => p + resultado.puntaje)
      setUltimoResultado({ ...resultado, nivelId: nivel.id, primerVez: !yaEstaba })
    },
    [nivelesCompletados, preferencia, productosDesbloqueados, colaProductos]
  )

  const guardarPrimerProducto = useCallback(() => {
    const [actual, ...resto] = colaProductos
    if (!actual) return
    setProductosDesbloqueados((prev) => (prev.includes(actual) ? prev : [...prev, actual]))
    setColaProductos(resto)
  }, [colaProductos])

  const registrarJugador = useCallback((nombre) => setNombreJugador(nombre), [])

  const limpiarProgreso = () => {
    setNivelesCompletados([])
    setProductosDesbloqueados([])
    setColaProductos([])
    setPalabrasEncontradasTotal(0)
    setPuntajeTotal(0)
    setUltimoResultado(null)
  }

  // "¿No sos vos?": borra todo lo guardado y vuelve al registro.
  const cambiarJugador = () => {
    borrarProgreso()
    setNombreJugador('')
    setPreferencia('')
    limpiarProgreso()
  }

  // "Volver a jugar": mismo jugador y mismo gusto, alacena en cero.
  const reiniciarJuego = () => limpiarProgreso()

  const valor = useMemo(
    () => ({
      nombreJugador,
      preferencia,
      nivelesCompletados,
      productosDesbloqueados,
      colaProductos,
      palabrasEncontradasTotal,
      puntajeTotal,
      ultimoResultado,
      juegoTerminado,
      registrarJugador,
      setPreferencia,
      completarNivel,
      guardarPrimerProducto,
      cambiarJugador,
      reiniciarJuego,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nombreJugador, preferencia, nivelesCompletados, productosDesbloqueados, colaProductos, palabrasEncontradasTotal, puntajeTotal, ultimoResultado, juegoTerminado, completarNivel, guardarPrimerProducto, registrarJugador]
  )

  return <JuegoContext.Provider value={valor}>{children}</JuegoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useJuego() {
  const ctx = useContext(JuegoContext)
  if (!ctx) throw new Error('useJuego debe usarse dentro de <JuegoProvider>')
  return ctx
}
