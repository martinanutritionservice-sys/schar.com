import { NIVELES, PRODUCTOS } from '../data/levels.js'

// Guarda el progreso del jugador en el navegador (localStorage) para que,
// si recarga la página o vuelve otro día, no pierda el nombre, los niveles
// ni la alacena. Todo va envuelto en try/catch: si el navegador no deja
// guardar (modo privado, etc.) el juego simplemente sigue sin guardar.
const CLAVE = 'mision-sin-gluten-progreso-v1'

const VACIO = {
  nombreJugador: '',
  nivelesCompletados: [],
  productosDesbloqueados: [],
  palabrasEncontradasTotal: 0,
  puntajeTotal: 0,
}

export function cargarProgreso() {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return { ...VACIO }
    const d = JSON.parse(crudo)

    const idsNiveles = NIVELES.map((n) => n.id)
    const idsProductos = PRODUCTOS.map((p) => p.id)
    const nivelesCompletados = (Array.isArray(d.nivelesCompletados) ? d.nivelesCompletados : []).filter((id) =>
      idsNiveles.includes(id)
    )

    // Si se cerró la página justo entre "nivel completo" y "guardar en la
    // alacena", los productos de los niveles ya completados se recuperan
    // acá para que el jugador nunca pierda un premio ganado.
    const deNivelesCompletos = NIVELES.filter((n) => nivelesCompletados.includes(n.id)).flatMap((n) => n.productosIds)
    const guardados = Array.isArray(d.productosDesbloqueados) ? d.productosDesbloqueados : []
    const productosDesbloqueados = idsProductos.filter((id) => guardados.includes(id) || deNivelesCompletos.includes(id))

    return {
      nombreJugador: typeof d.nombreJugador === 'string' ? d.nombreJugador.slice(0, 30) : '',
      nivelesCompletados,
      productosDesbloqueados,
      palabrasEncontradasTotal: Number.isFinite(d.palabrasEncontradasTotal) ? d.palabrasEncontradasTotal : 0,
      puntajeTotal: Number.isFinite(d.puntajeTotal) ? d.puntajeTotal : 0,
    }
  } catch {
    return { ...VACIO }
  }
}

export function guardarProgreso(progreso) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(progreso))
  } catch {
    // sin almacenamiento disponible: se sigue jugando igual
  }
}

export function borrarProgreso() {
  try {
    window.localStorage.removeItem(CLAVE)
  } catch {
    // nada que borrar
  }
}
