import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { NIVELES, getNivelPorId, getProductoPorId } from './data/levels.js'
import { useEscalaPantalla } from './hooks/useEscalaPantalla.js'
import { JuegoProvider, useJuego } from './context/JuegoContext.jsx'

import SplashScreen from './screens/SplashScreen.jsx'
import NameScreen from './screens/NameScreen.jsx'
import PreferenceScreen from './screens/PreferenceScreen.jsx'
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
import NotFoundScreen from './screens/NotFoundScreen.jsx'
import Button from './components/Button.jsx'

// ---------------------------------------------------------------------------
// Mapa de navegación (React Router)
//   /                       bienvenida
//   /nombre                 registro del jugador
//   /preferencia            ¿dulce o salado?
//   /inicio                 menú principal
//   /como-jugar             instrucciones
//   /niveles                selección de nivel
//   /nivel/:id              presentación del nivel
//   /nivel/:id/jugar        el juego
//   /nivel/:id/completo     misión cumplida
//   /premio                 producto desbloqueado (con rayos y confetti)
//   /premio/producto        detalle del producto + guardar en la alacena
//   /alacena                colección de productos
//   /final                  pantalla de cierre (solo si completaste los 6 niveles)
//   *                       página no encontrada
// ---------------------------------------------------------------------------

// Rutas que necesitan haberte registrado: si todavía no pusiste tu nombre o
// tu gusto, te mandan a completarlos y recién después seguís.
function Requiere({ children }) {
  const { nombreJugador, preferencia } = useJuego()
  if (!nombreJugador) return <Navigate to="/nombre" replace />
  if (!preferencia) return <Navigate to="/preferencia" replace />
  return children
}

// Un nivel se puede abrir si es el primero o si completaste el anterior.
function useNivelDesbloqueado() {
  const { id } = useParams()
  const { nivelesCompletados } = useJuego()
  const nivel = getNivelPorId(id)
  if (!nivel) return { nivel: null, permitido: false }
  const idx = NIVELES.findIndex((n) => n.id === nivel.id)
  const permitido = idx === 0 || nivelesCompletados.includes(NIVELES[idx - 1].id)
  return { nivel, permitido }
}

function RutaSplash() {
  const navigate = useNavigate()
  return <SplashScreen onComenzar={() => navigate('/inicio')} />
}

function RutaNombre() {
  const navigate = useNavigate()
  const { registrarJugador, preferencia } = useJuego()
  return (
    <NameScreen
      onContinuar={(nombre) => {
        registrarJugador(nombre)
        navigate(preferencia ? '/inicio' : '/preferencia')
      }}
    />
  )
}

function RutaPreferencia() {
  const navigate = useNavigate()
  const { nombreJugador, preferencia, setPreferencia } = useJuego()
  if (!nombreJugador) return <Navigate to="/nombre" replace />
  return (
    <PreferenceScreen
      nombreJugador={nombreJugador}
      actual={preferencia}
      onVolver={preferencia ? () => navigate('/inicio') : undefined}
      onElegir={(p) => {
        setPreferencia(p)
        navigate('/inicio')
      }}
    />
  )
}

function RutaInicio() {
  const navigate = useNavigate()
  const { nombreJugador, preferencia, cambiarJugador } = useJuego()
  return (
    <HomeScreen
      nombreJugador={nombreJugador}
      preferencia={preferencia}
      onJugar={() => navigate('/niveles')}
      onAlacena={() => navigate('/alacena')}
      onComoJugar={() => navigate('/como-jugar')}
      onCambiarGusto={() => navigate('/preferencia')}
      onCambiarJugador={() => {
        cambiarJugador()
        navigate('/nombre')
      }}
    />
  )
}

function RutaNiveles() {
  const navigate = useNavigate()
  const { nivelesCompletados } = useJuego()
  return (
    <LevelSelectScreen
      niveles={NIVELES}
      nivelesCompletados={nivelesCompletados}
      onSelectNivel={(id) => navigate(`/nivel/${id}`)}
      onVolver={() => navigate('/inicio')}
    />
  )
}

function RutaIntroNivel() {
  const navigate = useNavigate()
  const { nivel, permitido } = useNivelDesbloqueado()
  if (!nivel || !permitido) return <Navigate to="/niveles" replace />
  return (
    <LevelIntroScreen nivel={nivel} onComenzar={() => navigate(`/nivel/${nivel.id}/jugar`)} onVolver={() => navigate('/niveles')} />
  )
}

function RutaJuego() {
  const navigate = useNavigate()
  const { nombreJugador, completarNivel } = useJuego()
  const { nivel, permitido } = useNivelDesbloqueado()
  if (!nivel || !permitido) return <Navigate to="/niveles" replace />
  return (
    <GameScreen
      nivel={nivel}
      nombreJugador={nombreJugador}
      onNivelCompleto={(n, resultado) => {
        completarNivel(n, resultado)
        navigate(`/nivel/${n.id}/completo`, { replace: true })
      }}
      onVolver={() => navigate('/niveles')}
    />
  )
}

function RutaNivelCompleto() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { nombreJugador, nivelesCompletados, colaProductos, juegoTerminado, ultimoResultado } = useJuego()
  if (!nivelesCompletados.includes(Number(id))) return <Navigate to="/niveles" replace />
  const resultado = ultimoResultado?.nivelId === Number(id) ? ultimoResultado : null
  const siguiente = juegoTerminado ? '/final' : '/niveles'
  return (
    <LevelCompleteScreen
      nombreJugador={nombreJugador}
      resultado={resultado}
      onVerPremio={() => navigate(colaProductos.length > 0 ? '/premio' : siguiente)}
    />
  )
}

function RutaPremio() {
  const navigate = useNavigate()
  const { colaProductos, juegoTerminado } = useJuego()
  // Sin premios pendientes no hay nada que mostrar acá: se sigue al próximo paso.
  if (colaProductos.length === 0) return <Navigate to={juegoTerminado ? '/final' : '/niveles'} replace />
  return <PrizeScreen producto={getProductoPorId(colaProductos[0])} onSumarAlacena={() => navigate('/premio/producto')} />
}

function RutaProducto() {
  const navigate = useNavigate()
  const { colaProductos, guardarPrimerProducto, juegoTerminado, preferencia } = useJuego()
  // Al guardar el último premio la cola queda vacía antes de que el router
  // termine de cambiar de ruta: por eso este redirect apunta al mismo destino.
  if (colaProductos.length === 0) return <Navigate to={juegoTerminado ? '/final' : '/niveles'} replace />
  const producto = getProductoPorId(colaProductos[0])
  return (
    <ProductUnlockedScreen
      producto={producto}
      esDeTuGusto={producto.tipo === preferencia}
      onGuardar={() => {
        guardarPrimerProducto()
        navigate(colaProductos.length > 1 ? '/premio' : juegoTerminado ? '/final' : '/niveles', { replace: true })
      }}
    />
  )
}

function RutaAlacena() {
  const navigate = useNavigate()
  const { productosDesbloqueados } = useJuego()
  return <AlacenaScreen productosDesbloqueados={productosDesbloqueados} onVolver={() => navigate('/inicio')} />
}

function RutaFinal() {
  const navigate = useNavigate()
  const juego = useJuego()
  if (!juego.juegoTerminado) return <Navigate to="/inicio" replace />
  return (
    <FinalScreen
      nombreJugador={juego.nombreJugador}
      preferencia={juego.preferencia}
      nivelesCompletados={juego.nivelesCompletados}
      productosDesbloqueados={juego.productosDesbloqueados}
      palabrasEncontradasTotal={juego.palabrasEncontradasTotal}
      puntajeTotal={juego.puntajeTotal}
      onAlacena={() => navigate('/alacena')}
      onVolverAJugar={() => {
        juego.reiniciarJuego()
        navigate('/inicio')
      }}
    />
  )
}

// Botón "INICIO" flotante: aparece en las secciones donde tiene sentido salir.
// No aparece en la bienvenida, el registro, el inicio mismo ni en el tramo del
// premio (nivel completo -> premio -> producto), porque ahí hay un producto
// por guardar y salir a la mitad lo haría esperar.
const RUTAS_CON_INICIO = [/^\/como-jugar$/, /^\/niveles$/, /^\/nivel\/\d+$/, /^\/nivel\/\d+\/jugar$/, /^\/alacena$/, /^\/final$/]

export default function App() {
  const escala = useEscalaPantalla()
  return (
    <JuegoProvider>
      <Marco escala={escala} />
    </JuegoProvider>
  )
}

function Marco({ escala }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const mostrarInicio = RUTAS_CON_INICIO.some((r) => r.test(pathname))
  const enJuego = /\/jugar$/.test(pathname)

  const handleInicio = () => {
    // En pleno juego se pregunta antes: salir hace perder el avance del nivel.
    if (enJuego) {
      setConfirmarSalida(true)
      return
    }
    navigate('/inicio')
  }

  return (
    <div className="phone-frame" style={{ transform: `scale(${escala})` }}>
      <div className={`phone-screen${mostrarInicio ? ' phone-screen--con-inicio' : ''}`}>
        <Routes>
          <Route path="/" element={<RutaSplash />} />
          <Route path="/nombre" element={<RutaNombre />} />
          <Route path="/preferencia" element={<RutaPreferencia />} />
          <Route path="/inicio" element={<Requiere><RutaInicio /></Requiere>} />
          <Route path="/como-jugar" element={<Requiere><HowToPlayRoute /></Requiere>} />
          <Route path="/niveles" element={<Requiere><RutaNiveles /></Requiere>} />
          <Route path="/nivel/:id" element={<Requiere><RutaIntroNivel /></Requiere>} />
          <Route path="/nivel/:id/jugar" element={<Requiere><RutaJuego /></Requiere>} />
          <Route path="/nivel/:id/completo" element={<Requiere><RutaNivelCompleto /></Requiere>} />
          <Route path="/premio" element={<Requiere><RutaPremio /></Requiere>} />
          <Route path="/premio/producto" element={<Requiere><RutaProducto /></Requiere>} />
          <Route path="/alacena" element={<Requiere><RutaAlacena /></Requiere>} />
          <Route path="/final" element={<Requiere><RutaFinal /></Requiere>} />
          <Route path="*" element={<NotFoundScreen onVolver={() => navigate('/')} />} />
        </Routes>
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
            <Button
              variant="ghost"
              onClick={() => {
                setConfirmarSalida(false)
                navigate('/inicio')
              }}
            >
              SALIR AL INICIO
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function HowToPlayRoute() {
  const navigate = useNavigate()
  return <HowToPlayScreen onVolver={() => navigate('/inicio')} onJugar={() => navigate('/niveles')} />
}
