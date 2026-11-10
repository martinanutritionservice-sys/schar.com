import { NIVELES, PRODUCTOS } from '../data/levels.js'

// Guarda el progreso del jugador en el navegador (localStorage) para que,
// si recarga la página o vuelve otro día, no pierda el nombre, los niveles
// ni la alacena. Todo va envuelto en try/catch: si el navegador no deja
// guardar (modo privado, etc.) el juego simplemente sigue sin guardar.
const CLAVE = 'mision-sin-gluten-progreso-v1'

const VACIO = {
  nombreJugador: '',
  preferencia: '', // 'dulce' | 'salado' | 'ambos'
  nivelesCompletados: [],
  productosDesbloqueados: [],
  colaProductos: [], // premios ganados que todavía no se guardaron en la alacena
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
    const lista = (x) => (Array.isArray(x) ? x : [])

    const productosDesbloqueados = lista(d.productosDesbloqueados).filter((id) => idsProductos.includes(id))
    // Si se cerró la página justo entre "nivel completo" y "guardar en la
    // alacena", los premios pendientes se recuperan para no perderlos.
    const colaProductos = lista(d.colaProductos).filter(
      (id) => idsProductos.includes(id) && !productosDesbloqueados.includes(id)
    )

    return {
      nombreJugador: typeof d.nombreJugador === 'string' ? d.nombreJugador.slice(0, 30) : '',
      preferencia: ['dulce', 'salado', 'ambos'].includes(d.preferencia) ? d.preferencia : '',
      nivelesCompletados: lista(d.nivelesCompletados).filter((id) => idsNiveles.includes(id)),
      productosDesbloqueados,
      colaProductos,
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
