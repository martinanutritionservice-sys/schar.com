import { useEffect, useRef, useState } from 'react'

// El tablero de juego. Toda la lógica de qué palabra se formó vive en el
// hook useWordSearch; este componente dibuja la grilla y traduce los
// eventos de puntero (mouse o dedo) en "iniciar / continuar / finalizar
// arrastre", imitando cómo se marca una sopa de letras en papel: se apoya
// el dedo en la primera letra, se desliza hasta la última y se suelta.
// Mientras se arrastra, además, se dibuja un trazo tipo resaltador entre
// la primera letra y la celda actual, para que se sienta como marcar de
// verdad con un marcador en vez de solo "iluminar" celdas sueltas.
export default function WordSearchGrid({
  grilla,
  estadoCeldas,
  celdaInicio,
  celdaActual,
  celdaPista,
  onIniciarArrastre,
  onContinuarArrastre,
  onFinalizarArrastre,
}) {
  const gridRef = useRef(null)
  const arrastrandoRef = useRef(false)
  const tamaño = grilla.length
  const [trazo, setTrazo] = useState(null)

  // El tamaño de letra se recalcula según el ancho real de la grilla en
  // pantalla (no según el ancho de la ventana), así el texto siempre
  // entra en su celda sin importar cuántas columnas tenga el nivel.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const actualizarTamañoFuente = () => {
      const anchoCelda = el.clientWidth / tamaño
      const fuente = Math.max(9, Math.min(anchoCelda * 0.52, 20))
      el.style.setProperty('--cell-font', `${fuente.toFixed(1)}px`)
    }

    actualizarTamañoFuente()
    const observer = new ResizeObserver(actualizarTamañoFuente)
    observer.observe(el)
    return () => observer.disconnect()
  }, [tamaño])

  // Recalcula la posición/ángulo del trazo resaltador cada vez que
  // cambia la celda inicial o la celda actual del arrastre.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !celdaInicio) {
      setTrazo(null)
      return
    }
    const fin = celdaActual || celdaInicio
    const elA = grid.querySelector(`[data-fila="${celdaInicio.fila}"][data-col="${celdaInicio.col}"]`)
    const elB = grid.querySelector(`[data-fila="${fin.fila}"][data-col="${fin.col}"]`)
    if (!elA || !elB) {
      setTrazo(null)
      return
    }
    // Se usan offsetLeft/offsetTop/offsetWidth (medidas de layout, sin
    // transformaciones) y NO getBoundingClientRect: el marco del celular se
    // achica con transform:scale() cuando la ventana es chica, y el trazo
    // vive dentro de ese mismo marco. Medir en píxeles "visuales" hacía que
    // el trazo quedara más corto y corrido respecto de las letras.
    const ancho = elA.offsetWidth
    const ax = elA.offsetLeft + ancho / 2
    const ay = elA.offsetTop + elA.offsetHeight / 2
    const bx = elB.offsetLeft + elB.offsetWidth / 2
    const by = elB.offsetTop + elB.offsetHeight / 2
    const dx = bx - ax
    const dy = by - ay
    const distancia = Math.hypot(dx, dy)

    setTrazo({
      x: (ax + bx) / 2,
      y: (ay + by) / 2,
      largo: distancia + ancho,
      angulo: (Math.atan2(dy, dx) * 180) / Math.PI,
      grosor: ancho * 0.64,
    })
  }, [celdaInicio, celdaActual])

  // Durante el arrastre escuchamos el movimiento y la soltada en toda la
  // ventana (no solo sobre la celda actual), porque el dedo/mouse puede
  // moverse más rápido que los eventos y salirse momentáneamente de una
  // celda sin que el arrastre deba cortarse.
  useEffect(() => {
    const detectarCelda = (clientX, clientY) => {
      const el = document.elementFromPoint(clientX, clientY)
      const celda = el?.closest?.('[data-fila]')
      if (!celda) return null
      return { fila: Number(celda.dataset.fila), col: Number(celda.dataset.col) }
    }

    const handleMove = (e) => {
      if (!arrastrandoRef.current) return
      const punto = e.touches ? e.touches[0] : e
      const celda = detectarCelda(punto.clientX, punto.clientY)
      if (celda) onContinuarArrastre(celda.fila, celda.col)
    }

    const handleUp = () => {
      if (!arrastrandoRef.current) return
      arrastrandoRef.current = false
      onFinalizarArrastre()
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [onContinuarArrastre, onFinalizarArrastre])

  const handlePointerDown = (fila, col) => (e) => {
    e.preventDefault()
    arrastrandoRef.current = true
    onIniciarArrastre(fila, col)
  }

  return (
    <div className="word-grid-wrapper">
      <div
        className="word-grid"
        ref={gridRef}
        style={{ gridTemplateColumns: `repeat(${tamaño}, 1fr)` }}
      >
        {grilla.map((fila, f) =>
          fila.map((letra, c) => {
            const key = `${f}-${c}`
            const estado = estadoCeldas[key] || {}
            const clases = ['word-grid__cell']
            if (estado.encontrada) clases.push('word-grid__cell--encontrada')
            if (estado.resaltada) clases.push('word-grid__cell--seleccionada')
            if (estado.invalida) clases.push('word-grid__cell--invalida')
            if (celdaPista && celdaPista.fila === f && celdaPista.col === c) clases.push('word-grid__cell--pista')

            return (
              <button
                key={key}
                type="button"
                data-fila={f}
                data-col={c}
                className={clases.join(' ')}
                onPointerDown={handlePointerDown(f, c)}
                aria-label={`Letra ${letra}, fila ${f + 1}, columna ${c + 1}`}
              >
                {letra}
              </button>
            )
          })
        )}
      </div>

      {trazo && (
        <div
          className="word-grid__trazo"
          style={{
            width: `${trazo.largo}px`,
            height: `${trazo.grosor}px`,
            left: `${trazo.x}px`,
            top: `${trazo.y}px`,
            transform: `translate(-50%, -50%) rotate(${trazo.angulo}deg)`,
          }}
        />
      )}
    </div>
  )
}
