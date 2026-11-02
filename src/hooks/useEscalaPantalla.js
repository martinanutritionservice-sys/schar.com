import { useEffect, useState } from 'react'

const ANCHO_BASE = 390
const ALTO_BASE = 844
const MARGEN_ESCRITORIO = 24 // aire alrededor del marco en pantallas grandes

// Calcula el factor de escala para que el marco de 390x844 entre
// SIEMPRE completo (bordes incluidos) en la ventana actual, sin
// importar qué tan chica o angosta sea. En vez de dejar que el CSS
// achique el ancho y reacomode el contenido adentro (lo que podía
// desalinear textos y botones), acá se escala el marco entero como un
// bloque fijo: por dentro nunca cambia de tamaño ni se reordena, solo
// se ve más chico o más grande en pantalla. Así se ve siempre igual,
// nada se mueve de lugar, y el borde tipo celular nunca queda cortado.
export function useEscalaPantalla() {
  const [escala, setEscala] = useState(1)

  useEffect(() => {
    const calcular = () => {
      const esMovil = window.innerWidth < 430
      const anchoDisponible = esMovil ? window.innerWidth : window.innerWidth - MARGEN_ESCRITORIO * 2
      const altoDisponible = esMovil ? window.innerHeight : window.innerHeight - MARGEN_ESCRITORIO * 2

      const nuevaEscala = Math.min(1, anchoDisponible / ANCHO_BASE, altoDisponible / ALTO_BASE)
      setEscala(nuevaEscala)
    }

    calcular()
    window.addEventListener('resize', calcular)
    return () => window.removeEventListener('resize', calcular)
  }, [])

  return escala
}
