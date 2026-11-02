// Efectos de sonido generados con la Web Audio API — no dependen de
// archivos externos, así que no hay nada que se rompa por una ruta mal
// copiada o un asset que falta. sonidoActivo() respeta el mute global.

let audioCtx = null
let activo = true

if (typeof window !== 'undefined') {
  try {
    const guardado = window.localStorage.getItem('schar-sonido-on')
    if (guardado !== null) activo = guardado !== 'false'
  } catch {
    // localStorage puede no estar disponible (modo privado); seguimos con el default.
  }
}

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    audioCtx = new AudioContextClass()
  }
  // Los navegadores suspenden el audio hasta el primer gesto del usuario;
  // como estos sonidos siempre se disparan después de un click, lo
  // reanudamos por las dudas.
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function setSonidoActivo(valor) {
  activo = valor
  try {
    window.localStorage.setItem('schar-sonido-on', String(valor))
  } catch {
    // si no se puede persistir, el toggle sigue funcionando solo en esta sesión.
  }
}

export function getSonidoActivo() {
  return activo
}

function tono({ frecuencia, duracion = 0.15, tipo = 'sine', volumen = 0.18, inicioEn = 0 }) {
  const ctx = getCtx()
  if (!ctx || !activo) return
  const t0 = ctx.currentTime + inicioEn
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(frecuencia, t0)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volumen, t0 + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duracion + 0.02)
}

export function sonidoAcierto() {
  // Dos notas ascendentes, tipo "ding" positivo
  tono({ frecuencia: 660, duracion: 0.12, tipo: 'triangle' })
  tono({ frecuencia: 880, duracion: 0.18, tipo: 'triangle', inicioEn: 0.09 })
}

export function sonidoError() {
  // Un solo tono grave y corto
  tono({ frecuencia: 160, duracion: 0.18, tipo: 'square', volumen: 0.12 })
}

export function sonidoVictoria() {
  // Arpegio ascendente de 4 notas
  const notas = [523, 659, 784, 1047]
  notas.forEach((frecuencia, i) => tono({ frecuencia, duracion: 0.22, tipo: 'triangle', inicioEn: i * 0.12 }))
}

export function sonidoClick() {
  tono({ frecuencia: 420, duracion: 0.05, tipo: 'sine', volumen: 0.08 })
}
