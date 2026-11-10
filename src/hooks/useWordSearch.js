import { useMemo, useState, useCallback, useRef } from 'react'

// 8 direcciones posibles: horizontal, vertical y diagonales (y sus inversas)
const DIRECCIONES = [
  { dr: 0, dc: 1 },   // →
  { dr: 0, dc: -1 },  // ←
  { dr: 1, dc: 0 },   // ↓
  { dr: -1, dc: 0 },  // ↑
  { dr: 1, dc: 1 },   // ↘
  { dr: -1, dc: -1 }, // ↖
  { dr: 1, dc: -1 },  // ↙
  { dr: -1, dc: 1 },  // ↗
]

// Nombres de las direcciones, para poder elegir cuáles usa cada nivel.
// Las palabras "al revés" (← ↑ ↖ ↙) son las más difíciles de ver, así que
// los niveles fáciles las dejan afuera.
export const DIRECCIONES_POR_DIFICULTAD = {
  facil: [DIRECCIONES[0], DIRECCIONES[2]], // → ↓
  medio: [DIRECCIONES[0], DIRECCIONES[2], DIRECCIONES[4]], // → ↓ ↘
  dificil: [DIRECCIONES[0], DIRECCIONES[2], DIRECCIONES[4], DIRECCIONES[7]], // → ↓ ↘ ↗
  experto: DIRECCIONES, // las 8, incluso al revés
}

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function letraAleatoria() {
  return ALFABETO[Math.floor(Math.random() * ALFABETO.length)]
}

/**
 * Genera una grilla NxN con las palabras dadas ubicadas en direcciones
 * aleatorias, y el resto de las celdas rellenas con letras al azar.
 * Este resultado cambia en cada partida: es el "comportamiento dinámico"
 * del juego, no un tablero fijo cargado a mano.
 */
export function generarGrilla(palabras, tamaño, direcciones = DIRECCIONES, reintentos = 50) {
  const grilla = Array.from({ length: tamaño }, () => Array(tamaño).fill(null))
  const ubicaciones = {} // palabra -> [{fila, col}, ...] en orden

  const palabrasOrdenadas = [...palabras].sort((a, b) => b.length - a.length)

  for (const palabraOriginal of palabrasOrdenadas) {
    const palabra = palabraOriginal.toUpperCase()
    let colocada = false
    let intentos = 0

    while (!colocada && intentos < 200) {
      intentos++
      const dir = direcciones[Math.floor(Math.random() * direcciones.length)]
      const filaInicio = Math.floor(Math.random() * tamaño)
      const colInicio = Math.floor(Math.random() * tamaño)

      const filaFin = filaInicio + dir.dr * (palabra.length - 1)
      const colFin = colInicio + dir.dc * (palabra.length - 1)
      if (filaFin < 0 || filaFin >= tamaño || colFin < 0 || colFin >= tamaño) continue

      let cabe = true
      const celdas = []
      for (let i = 0; i < palabra.length; i++) {
        const f = filaInicio + dir.dr * i
        const c = colInicio + dir.dc * i
        const existente = grilla[f][c]
        if (existente !== null && existente !== palabra[i]) {
          cabe = false
          break
        }
        celdas.push({ fila: f, col: c })
      }

      if (cabe) {
        celdas.forEach((celda, i) => {
          grilla[celda.fila][celda.col] = palabra[i]
        })
        ubicaciones[palabra] = celdas
        colocada = true
      }
    }

  }

  // Si por mala suerte alguna palabra no entró (pasa muy rara vez cuando hay
  // dos palabras de 10 letras en una grilla de 10 x 10), se arma un tablero
  // nuevo desde cero: así NUNCA queda una palabra que no se pueda encontrar.
  if (palabras.some((p) => !ubicaciones[p.toUpperCase()]) && reintentos > 0) {
    return generarGrilla(palabras, tamaño, direcciones, reintentos - 1)
  }

  for (let f = 0; f < tamaño; f++) {
    for (let c = 0; c < tamaño; c++) {
      if (grilla[f][c] === null) grilla[f][c] = letraAleatoria()
    }
  }

  return { grilla, ubicaciones }
}

function esLineaRecta(fila1, col1, fila2, col2) {
  const df = fila2 - fila1
  const dc = col2 - col1
  if (df === 0 && dc === 0) return null
  if (df === 0) return { dr: 0, dc: dc > 0 ? 1 : -1, largo: Math.abs(dc) + 1 }
  if (dc === 0) return { dr: df > 0 ? 1 : -1, dc: 0, largo: Math.abs(df) + 1 }
  if (Math.abs(df) === Math.abs(dc)) {
    return { dr: df > 0 ? 1 : -1, dc: dc > 0 ? 1 : -1, largo: Math.abs(df) + 1 }
  }
  return null
}

/**
 * Hook reutilizable: dado un nivel (lista de palabras y tamaño de grilla),
 * arma el tablero y expone el estado + la lógica de selección para que
 * el componente de UI (WordSearchGrid) quede liviano y solo dibuje.
 *
 * La selección funciona "arrastrando" de punta a punta de la palabra,
 * como en una sopa de letras de papel: se marca la celda inicial al
 * apoyar el dedo/mouse (iniciarArrastre), se va resaltando el camino en
 * línea recta mientras se mueve (continuarArrastre) y se valida la
 * palabra recién al soltar (finalizarArrastre).
 */
export function useWordSearch(palabras, tamaño = 10, dificultad = 'facil') {
  const direcciones = DIRECCIONES_POR_DIFICULTAD[dificultad] || DIRECCIONES
  const [{ grilla, ubicaciones }, setTablero] = useState(() => generarGrilla(palabras, tamaño, direcciones))
  const [celdaInicio, setCeldaInicio] = useState(null)
  const [celdaActual, setCeldaActual] = useState(null)
  const [celdasEncontradas, setCeldasEncontradas] = useState({}) // "fila-col" -> true
  const [ultimoIntentoInvalido, setUltimoIntentoInvalido] = useState(null)
  // Copia "en vivo" del arrastre en curso. El estado de React se actualiza
  // recién en el próximo render, pero un dedo rápido puede soltar antes de
  // ese render: leyendo de estas refs, la última celda tocada nunca se pierde.
  const inicioRef = useRef(null)
  const actualRef = useRef(null)

  const reiniciar = useCallback(() => {
    setTablero(generarGrilla(palabras, tamaño, direcciones))
    setCeldaInicio(null)
    setCeldaActual(null)
    setCeldasEncontradas({})
    setUltimoIntentoInvalido(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palabras, tamaño, direcciones])

  const marcarEncontrada = useCallback((celdas) => {
    setCeldasEncontradas((prev) => {
      const copia = { ...prev }
      celdas.forEach(({ fila, col }) => {
        copia[`${fila}-${col}`] = true
      })
      return copia
    })
  }, [])

  /**
   * Intenta formar una palabra entre dos celdas. Devuelve la palabra
   * encontrada (o null) para que quien llame decida qué hacer (sumar
   * puntos, restar una vida, mostrar el dato educativo, etc).
   */
  const intentarSeleccion = useCallback(
    (fila1, col1, fila2, col2, palabrasRestantes) => {
      const linea = esLineaRecta(fila1, col1, fila2, col2)
      if (!linea) return { celdas: [], palabra: null }

      const celdas = []
      let letras = ''
      for (let i = 0; i < linea.largo; i++) {
        const f = fila1 + linea.dr * i
        const c = col1 + linea.dc * i
        celdas.push({ fila: f, col: c })
        letras += grilla[f][c]
      }

      const letrasInvertidas = letras.split('').reverse().join('')
      const encontrada = palabrasRestantes.find(
        (p) => p === letras || p === letrasInvertidas
      )

      return { celdas, palabra: encontrada || null }
    },
    [grilla]
  )

  // Se apoya el dedo/click en la celda inicial: arranca el arrastre.
  const iniciarArrastre = useCallback((fila, col) => {
    inicioRef.current = { fila, col }
    actualRef.current = { fila, col }
    setCeldaInicio({ fila, col })
    setCeldaActual({ fila, col })
  }, [])

  // Se mueve el dedo/mouse sobre una nueva celda mientras se arrastra.
  const continuarArrastre = useCallback((fila, col) => {
    actualRef.current = { fila, col }
    setCeldaActual((prev) => {
      if (prev && prev.fila === fila && prev.col === col) return prev
      return { fila, col }
    })
  }, [])

  // Camino en línea recta entre el inicio y la celda actual, para ir
  // "pintando" la selección en pantalla mientras se arrastra.
  const celdasResaltadas = useMemo(() => {
    if (!celdaInicio) return []
    if (!celdaActual || (celdaActual.fila === celdaInicio.fila && celdaActual.col === celdaInicio.col)) {
      return [celdaInicio]
    }
    const linea = esLineaRecta(celdaInicio.fila, celdaInicio.col, celdaActual.fila, celdaActual.col)
    if (!linea) return [celdaInicio]
    const celdas = []
    for (let i = 0; i < linea.largo; i++) {
      celdas.push({ fila: celdaInicio.fila + linea.dr * i, col: celdaInicio.col + linea.dc * i })
    }
    return celdas
  }, [celdaInicio, celdaActual])

  // Se suelta el dedo/click: se valida lo que quedó marcado.
  const finalizarArrastre = useCallback(
    (palabrasRestantes, onResultado) => {
      const inicio = inicioRef.current
      const actual = actualRef.current
      if (inicio && actual && !(inicio.fila === actual.fila && inicio.col === actual.col)) {
        const { celdas, palabra } = intentarSeleccion(inicio.fila, inicio.col, actual.fila, actual.col, palabrasRestantes)

        if (palabra) {
          marcarEncontrada(celdas)
          onResultado({ acierto: true, palabra, celdas })
        } else {
          setUltimoIntentoInvalido(celdas.length ? celdas : [inicio])
          onResultado({ acierto: false, palabra: null, celdas })
          window.setTimeout(() => setUltimoIntentoInvalido(null), 350)
        }
      }

      inicioRef.current = null
      actualRef.current = null
      setCeldaInicio(null)
      setCeldaActual(null)
    },
    [intentarSeleccion, marcarEncontrada]
  )

  const estadoCeldas = useMemo(() => {
    const mapa = {}
    for (let f = 0; f < tamaño; f++) {
      for (let c = 0; c < tamaño; c++) {
        const key = `${f}-${c}`
        mapa[key] = {
          resaltada: celdasResaltadas.some((cel) => cel.fila === f && cel.col === c),
          encontrada: !!celdasEncontradas[key],
          invalida:
            !!ultimoIntentoInvalido &&
            ultimoIntentoInvalido.some((cel) => cel.fila === f && cel.col === c),
        }
      }
    }
    return mapa
  }, [tamaño, celdasResaltadas, celdasEncontradas, ultimoIntentoInvalido])

  return {
    grilla,
    ubicaciones,
    estadoCeldas,
    celdaInicio,
    celdaActual,
    iniciarArrastre,
    continuarArrastre,
    finalizarArrastre,
    reiniciar,
  }
}
