// Datos del juego: niveles, bancos de palabras (con su dato educativo) y
// productos Schär que se desbloquean al completar cada nivel.
// Mantener el contenido separado de los componentes hace que agregar o
// modificar niveles no requiera tocar la lógica de la app (Single Responsibility).

import panBlanco from '../assets/productos/pan-blanco.webp'
import panHamburguesa from '../assets/productos/pan-hamburguesa.webp'
import crackers from '../assets/productos/crackers.webp'
import torradas from '../assets/productos/torradas.webp'
import fusilli from '../assets/productos/fusilli.webp'
import cornFlakes from '../assets/productos/corn-flakes.webp'
import chocoChip from '../assets/productos/choco-chip-cookies.webp'
import maria from '../assets/productos/maria.webp'
import curvies from '../assets/productos/curvies.webp'
import salinis from '../assets/productos/salinis.webp'
import snack from '../assets/productos/snack.webp'
import wafers from '../assets/productos/wafers.webp'

// Productos Schär reales (packaging + producto). Los textos salen de lo que
// dice cada envase. `tipo` ('dulce' | 'salado') sirve para personalizar el
// juego: en qué orden se desbloquean los premios y qué filtro tiene la alacena.
export const PRODUCTOS = [
  { id: 'pan-blanco', tipo: 'salado', nombre: 'Pan Blanco', descripcion: 'Pan en rebanadas de 200 g, listo para tus desayunos y tostadas.', usos: ['Desayunos', 'Meriendas'], emoji: '🍞', imagen: panBlanco },
  { id: 'pan-hamburguesa', tipo: 'salado', nombre: 'Pan Hamburguesa', descripcion: 'Con fermentación natural, ideal para armar tu hamburguesa favorita.', usos: ['Almuerzos', 'Cenas'], emoji: '🍔', imagen: panHamburguesa },
  { id: 'crackers', tipo: 'salado', nombre: 'Crackers', descripcion: 'Seis porciones individuales, crocantes y listas para llevar.', usos: ['Snacks', 'Picadas'], emoji: '🍘', imagen: crackers },
  { id: 'torradas', tipo: 'salado', nombre: 'Torradas Fette Biscottate', descripcion: 'Tostadas crocantes con trigo sarraceno, para untar lo que más te guste.', usos: ['Desayunos', 'Meriendas'], emoji: '🥖', imagen: torradas },
  { id: 'fusilli', tipo: 'salado', nombre: 'Fusilli', descripcion: 'Pasta sin gluten que se cocina en 10 a 12 minutos.', usos: ['Almuerzos', 'Cenas'], emoji: '🍝', imagen: fusilli },
  { id: 'corn-flakes', tipo: 'dulce', nombre: 'Corn Flakes', descripcion: 'Copos de maíz con vitamina B para arrancar el día.', usos: ['Desayunos'], emoji: '🥣', imagen: cornFlakes },
  { id: 'choco-chip-cookies', tipo: 'dulce', nombre: 'Choco Chip Cookies', descripcion: 'Galletitas con chips de chocolate, ideales para la merienda.', usos: ['Meriendas', 'Snacks'], emoji: '🍪', imagen: chocoChip },
  { id: 'maria', tipo: 'dulce', nombre: 'María', descripcion: 'Las galletitas de siempre, en tres porciones individuales.', usos: ['Desayunos', 'Meriendas'], emoji: '🍪', imagen: maria },
  { id: 'curvies', tipo: 'salado', nombre: 'Curvies Original', descripcion: 'Chips ondulados en un tubo resellable para compartir.', usos: ['Snacks', 'Picadas'], emoji: '🥔', imagen: curvies },
  { id: 'salinis', tipo: 'salado', nombre: 'Salinis', descripcion: 'Pretzels salados y sin lactosa, para picar en cualquier momento.', usos: ['Snacks', 'Picadas'], emoji: '🥨', imagen: salinis },
  { id: 'snack', tipo: 'dulce', nombre: 'Snack Milk Chocolate', descripcion: 'Obleas bañadas en chocolate con leche, en tres porciones.', usos: ['Meriendas', 'Postres'], emoji: '🍫', imagen: snack },
  { id: 'wafers', tipo: 'dulce', nombre: 'Wafers al Cacao', descripcion: 'Obleas rellenas con crema de cacao.', usos: ['Meriendas', 'Postres'], emoji: '🍫', imagen: wafers },
]

// ---------------------------------------------------------------------------
// NIVELES
// Cada nivel tiene un BANCO de palabras (más grande que lo que se juega) y
// en cada partida se sortean `cantidad` al azar: así nunca jugás dos veces
// el mismo tablero. Todo lo que hace más difícil un nivel está acá, en un
// solo lugar, para poder ajustarlo sin tocar la lógica del juego:
//   cantidad        -> cuántas palabras hay que encontrar
//   tiempoSegundos  -> tiempo total (baja de nivel en nivel)
//   vidas / pistas  -> margen de error y ayudas (bajan de nivel en nivel)
//   dificultad      -> en qué direcciones se esconden las palabras:
//                      facil (→ ↓), medio (+ ↘), dificil (+ ↗), experto (las 8, incluso al revés)
// Todas las palabras tienen como máximo 10 letras (la grilla es de 10 x 10).
// ---------------------------------------------------------------------------
export const NIVELES = [
  {
    id: 1,
    titulo: 'Conocé la celiaquía',
    dificultad: 'facil',
    etiqueta: 'Fácil',
    estrellas: 1,
    cantidad: 4,
    tiempoSegundos: 120,
    vidas: 5,
    pistas: 3,
    banco: [
      { palabra: 'CELIAQUIA', dato: 'La celiaquía es una enfermedad autoinmune crónica que daña el intestino delgado al consumir gluten.' },
      { palabra: 'GLUTEN', dato: 'El gluten es una proteína presente en el trigo, la cebada y el centeno.' },
      { palabra: 'AUTOINMUNE', dato: 'La celiaquía es una enfermedad autoinmune: el sistema inmune ataca por error al propio organismo.' },
      { palabra: 'INTESTINO', dato: 'En la celiaquía, el gluten daña las vellosidades del intestino delgado y dificulta absorber los nutrientes.' },
      { palabra: 'SINTOMAS', dato: 'Los síntomas de la celiaquía varían mucho: algunas personas tienen dolor abdominal o diarrea; otras, cansancio o anemia, y otras ningún síntoma visible.' },
      { palabra: 'ANTICUERPO', dato: 'El diagnóstico suele empezar con un análisis de sangre que busca anticuerpos característicos de la celiaquía.' },
      { palabra: 'BIOPSIA', dato: 'La biopsia del intestino delgado ayuda a confirmar el diagnóstico. Importante: hay que seguir comiendo gluten hasta terminar los estudios.' },
      { palabra: 'DIETA', dato: 'El único tratamiento de la celiaquía es una dieta sin gluten, estricta y de por vida.' },
    ],
  },
  {
    id: 2,
    titulo: '¿Dónde está el gluten?',
    dificultad: 'facil',
    etiqueta: 'Fácil',
    estrellas: 1,
    cantidad: 5,
    tiempoSegundos: 120,
    vidas: 5,
    pistas: 3,
    banco: [
      { palabra: 'PAN', dato: 'El pan tradicional se hace con harina de trigo, por eso siempre hay que buscar la versión sin gluten.' },
      { palabra: 'HARINA', dato: 'No toda harina es igual: la de trigo tiene gluten, pero existen mixes de harinas sin gluten.' },
      { palabra: 'CEBADA', dato: 'La cebada es uno de los tres cereales (junto al trigo y el centeno) que contienen gluten.' },
      { palabra: 'TRIGO', dato: 'El trigo es el cereal con gluten más usado en panes, pastas y galletitas.' },
      { palabra: 'CENTENO', dato: 'El centeno también contiene gluten, aunque mucha gente no lo sabe.' },
      { palabra: 'AVENA', dato: 'La avena puede contaminarse con gluten durante la cosecha o el procesamiento: solo conviene consumirla si está certificada sin gluten.' },
      { palabra: 'FIDEOS', dato: 'Los fideos comunes se hacen con harina de trigo; existen versiones elaboradas con harinas sin gluten, como las de maíz o arroz.' },
      { palabra: 'CERVEZA', dato: 'La cerveza común se elabora con cebada, por eso contiene gluten.' },
      { palabra: 'GALLETITAS', dato: 'Las galletitas comunes llevan harina de trigo: hay que elegir las que indican que son sin gluten.' },
      { palabra: 'SEMOLA', dato: 'La sémola se obtiene del trigo, así que contiene gluten.' },
    ],
  },
  {
    id: 3,
    titulo: 'Vivir sin gluten',
    dificultad: 'medio',
    etiqueta: 'Medio',
    estrellas: 2,
    cantidad: 6,
    tiempoSegundos: 115,
    vidas: 4,
    pistas: 2,
    banco: [
      { palabra: 'ETIQUETA', dato: 'Leer la etiqueta es clave: buscá siempre el símbolo o la leyenda "sin gluten" (libre de gluten).' },
      { palabra: 'CRUZADA', dato: 'La contaminación cruzada ocurre cuando un alimento sin gluten entra en contacto con otro que sí contiene gluten. Por eso es importante usar utensilios y superficies limpias y separadas.' },
      { palabra: 'SEGURO', dato: 'Un alimento "seguro" es aquel certificado o elaborado sin ningún contacto con gluten.' },
      { palabra: 'TACC', dato: 'TACC significa Trigo, Avena, Cebada y Centeno. En Argentina, "sin TACC" indica un alimento libre de gluten.' },
      { palabra: 'ANMAT', dato: 'La ANMAT es el organismo argentino que regula y controla los alimentos, incluidos los que se rotulan como libres de gluten.' },
      { palabra: 'ESPIGA', dato: 'La espiga tachada es un símbolo muy usado en el mundo para identificar productos sin gluten.' },
      { palabra: 'TOSTADOR', dato: 'Compartir el tostador con pan común puede contaminar tus tostadas sin gluten con migas.' },
      { palabra: 'MIGAS', dato: 'Unas pocas migas de pan común alcanzan para contaminar un alimento sin gluten.' },
    ],
  },
  {
    id: 4,
    titulo: 'Desafío Schär',
    dificultad: 'medio',
    etiqueta: 'Medio',
    estrellas: 2,
    cantidad: 6,
    tiempoSegundos: 110,
    vidas: 4,
    pistas: 2,
    banco: [
      { palabra: 'COOKIES', dato: 'Las Choco Chip Cookies Schär son galletitas sin gluten con chips de chocolate, ideales para la merienda.' },
      { palabra: 'MARIA', dato: 'Las galletitas María Schär vienen en tres porciones individuales y son sin gluten, como las de siempre.' },
      { palabra: 'MERIENDA', dato: 'Una merienda sin gluten puede ser igual de rica que cualquier otra: lo importante es leer la etiqueta.' },
      { palabra: 'CRACKERS', dato: 'Los Crackers Schär vienen en seis porciones individuales, crocantes y listos para llevar.' },
      { palabra: 'FUSILLI', dato: 'Los Fusilli Schär son una pasta sin gluten que se cocina en 10 a 12 minutos.' },
      { palabra: 'CURVIES', dato: 'Curvies Original son chips ondulados que vienen en un tubo resellable para compartir.' },
      { palabra: 'SALINIS', dato: 'Los Salinis son pretzels salados y sin lactosa, ideales para picar en cualquier momento.' },
      { palabra: 'WAFERS', dato: 'Los Wafers al Cacao son obleas rellenas con crema de cacao.' },
      { palabra: 'TORRADAS', dato: 'Las Torradas Fette Biscottate son tostadas crocantes con trigo sarraceno, para untar lo que más te guste.' },
      { palabra: 'SCHAR', dato: 'Schär es una empresa de origen italiano especializada en alimentos sin gluten.' },
    ],
  },
  {
    id: 5,
    titulo: 'Mitos y verdades',
    dificultad: 'dificil',
    etiqueta: 'Difícil',
    estrellas: 3,
    cantidad: 7,
    tiempoSegundos: 105,
    vidas: 3,
    pistas: 1,
    banco: [
      { palabra: 'ALERGIA', dato: 'La celiaquía no es una alergia ni una intolerancia: es una enfermedad autoinmune con base genética.' },
      { palabra: 'GENETICA', dato: 'La celiaquía tiene un componente genético: tener un familiar celíaco aumenta el riesgo de desarrollarla.' },
      { palabra: 'PERMANENTE', dato: 'Una vez diagnosticada, la celiaquía requiere una dieta sin gluten estricta y permanente, de por vida.' },
      { palabra: 'MITO', dato: 'Mito: "comer un poquito no hace daño". En la celiaquía, incluso cantidades muy pequeñas de gluten pueden dañar el intestino.' },
      { palabra: 'ESTRICTO', dato: 'La dieta sin gluten tiene que ser estricta: no alcanza con "comer menos" gluten.' },
      { palabra: 'NUTRICION', dato: 'Con ayuda de un/a nutricionista, una dieta sin gluten puede ser completa, variada y equilibrada.' },
      { palabra: 'CONTROL', dato: 'Las personas celíacas necesitan controles médicos periódicos para acompañar su salud.' },
      { palabra: 'MODA', dato: 'Para las personas celíacas, comer sin gluten no es una moda: es el tratamiento.' },
    ],
  },
  {
    id: 6,
    titulo: 'Cocina casera',
    dificultad: 'experto',
    etiqueta: 'Experto',
    estrellas: 4,
    cantidad: 8,
    tiempoSegundos: 100,
    vidas: 3,
    pistas: 0,
    banco: [
      { palabra: 'RECETA', dato: 'Adaptar una receta tradicional a sin gluten suele ser más simple de lo que parece: a veces alcanza con cambiar la harina.' },
      { palabra: 'LEVADURA', dato: 'La levadura no tiene gluten, así que se puede usar sin problema en panificados sin gluten.' },
      { palabra: 'UTENSILIOS', dato: 'Usar utensilios y superficies exclusivas para cocinar sin gluten evita la contaminación cruzada en casa.' },
      { palabra: 'ALMIDON', dato: 'El almidón de maíz o de mandioca se usa mucho en recetas sin gluten para lograr buena textura.' },
      { palabra: 'MAIZ', dato: 'El maíz es naturalmente libre de gluten.' },
      { palabra: 'ARROZ', dato: 'El arroz es naturalmente libre de gluten y se usa para hacer harinas y fideos sin gluten.' },
      { palabra: 'QUINOA', dato: 'La quinoa es naturalmente libre de gluten y aporta proteínas.' },
      { palabra: 'COLADOR', dato: 'Los coladores y otros utensilios difíciles de limpiar pueden retener restos de gluten: conviene tener los propios.' },
      { palabra: 'TABLA', dato: 'Las tablas de cocina, sobre todo las de madera, pueden retener restos de gluten: lo ideal es una tabla exclusiva.' },
      { palabra: 'MANDIOCA', dato: 'La mandioca es naturalmente libre de gluten y su almidón se usa en panificados sin gluten.' },
    ],
  },
]

export const TOTAL_PALABRAS = NIVELES.reduce((acc, n) => acc + n.cantidad, 0)

export function getProductoPorId(id) {
  return PRODUCTOS.find((p) => p.id === id)
}

export function getNivelPorId(id) {
  return NIVELES.find((n) => n.id === Number(id))
}

function mezclar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// Sortea las palabras de UNA partida: `cantidad` palabras al azar del banco.
export function elegirPalabras(nivel) {
  return mezclar(nivel.banco).slice(0, nivel.cantidad)
}

// Cuántos productos se ganan por nivel (6 niveles x 2 = los 12 de la alacena).
export const PREMIOS_POR_NIVEL = 2

// Personalización dulce / salado: elige los premios de un nivel entre los
// productos que todavía no tenés, dando prioridad a tu gusto.
//   'dulce' o 'salado' -> primero salen los de ese tipo
//   'ambos'            -> un dulce y un salado por nivel
export function elegirPremios(preferencia, desbloqueados, cantidad = PREMIOS_POR_NIVEL) {
  const faltan = PRODUCTOS.filter((p) => !desbloqueados.includes(p.id))
  if (preferencia === 'dulce' || preferencia === 'salado') {
    const gustan = faltan.filter((p) => p.tipo === preferencia)
    const resto = faltan.filter((p) => p.tipo !== preferencia)
    return [...gustan, ...resto].slice(0, cantidad).map((p) => p.id)
  }
  const dulces = faltan.filter((p) => p.tipo === 'dulce')
  const salados = faltan.filter((p) => p.tipo === 'salado')
  const alternados = []
  for (let i = 0; i < Math.max(dulces.length, salados.length); i++) {
    if (dulces[i]) alternados.push(dulces[i])
    if (salados[i]) alternados.push(salados[i])
  }
  return alternados.slice(0, cantidad).map((p) => p.id)
}

export const PREFERENCIAS = {
  dulce: { id: 'dulce', emoji: '🍪', titulo: 'Dulce', frase: 'Team Dulce' },
  salado: { id: 'salado', emoji: '🥨', titulo: 'Salado', frase: 'Team Salado' },
  ambos: { id: 'ambos', emoji: '🍪🥨', titulo: 'Los dos', frase: 'Team Dulce y Salado' },
}
