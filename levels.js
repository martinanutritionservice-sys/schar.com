// Datos del juego: niveles, palabras a encontrar, dato educativo por palabra
// y productos Schär que se desbloquean al completar cada nivel.
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

// Productos Schär reales (packaging + producto), en el orden en que se
// desbloquean: dos por nivel. Los textos salen de lo que dice cada envase.
export const PRODUCTOS = [
  { id: 'pan-blanco', nombre: 'Pan Blanco', descripcion: 'Pan en rebanadas de 200 g, listo para tus desayunos y tostadas.', usos: ['Desayunos', 'Meriendas'], emoji: '🍞', imagen: panBlanco },
  { id: 'pan-hamburguesa', nombre: 'Pan Hamburguesa', descripcion: 'Con fermentación natural, ideal para armar tu hamburguesa favorita.', usos: ['Almuerzos', 'Cenas'], emoji: '🍔', imagen: panHamburguesa },
  { id: 'crackers', nombre: 'Crackers', descripcion: 'Seis porciones individuales, crocantes y listas para llevar.', usos: ['Snacks', 'Picadas'], emoji: '🍘', imagen: crackers },
  { id: 'torradas', nombre: 'Torradas Fette Biscottate', descripcion: 'Tostadas crocantes con trigo sarraceno, para untar lo que más te guste.', usos: ['Desayunos', 'Meriendas'], emoji: '🥖', imagen: torradas },
  { id: 'fusilli', nombre: 'Fusilli', descripcion: 'Pasta sin gluten que se cocina en 10 a 12 minutos.', usos: ['Almuerzos', 'Cenas'], emoji: '🍝', imagen: fusilli },
  { id: 'corn-flakes', nombre: 'Corn Flakes', descripcion: 'Copos de maíz con vitamina B para arrancar el día.', usos: ['Desayunos'], emoji: '🥣', imagen: cornFlakes },
  { id: 'choco-chip-cookies', nombre: 'Choco Chip Cookies', descripcion: 'Galletitas con chips de chocolate, ideales para la merienda.', usos: ['Meriendas', 'Snacks'], emoji: '🍪', imagen: chocoChip },
  { id: 'maria', nombre: 'María', descripcion: 'Las galletitas de siempre, en tres porciones individuales.', usos: ['Desayunos', 'Meriendas'], emoji: '🍪', imagen: maria },
  { id: 'curvies', nombre: 'Curvies Original', descripcion: 'Chips ondulados en un tubo resellable para compartir.', usos: ['Snacks', 'Picadas'], emoji: '🥔', imagen: curvies },
  { id: 'salinis', nombre: 'Salinis', descripcion: 'Pretzels salados y sin lactosa, para picar en cualquier momento.', usos: ['Snacks', 'Picadas'], emoji: '🥨', imagen: salinis },
  { id: 'snack', nombre: 'Snack Milk Chocolate', descripcion: 'Obleas bañadas en chocolate con leche, en tres porciones.', usos: ['Meriendas', 'Postres'], emoji: '🍫', imagen: snack },
  { id: 'wafers', nombre: 'Wafers al Cacao', descripcion: 'Obleas rellenas con crema de cacao.', usos: ['Meriendas', 'Postres'], emoji: '🍫', imagen: wafers },
]

export const NIVELES = [
  {
    id: 1,
    titulo: 'Conocé la celiaquía',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 90,
    dificultad: 'facil',
    palabras: [
      { palabra: 'CELIAQUIA', dato: 'La celiaquía es una enfermedad autoinmune crónica que daña el intestino delgado al consumir gluten.' },
      { palabra: 'GLUTEN', dato: 'El gluten es una proteína presente en el trigo, la cebada y el centeno.' },
      { palabra: 'AUTOINMUNE', dato: 'La celiaquía es una enfermedad autoinmune: el sistema inmune ataca por error al propio organismo.' },
    ],
    productosIds: ['pan-blanco', 'pan-hamburguesa'],
  },
  {
    id: 2,
    titulo: '¿Dónde está el gluten?',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 90,
    dificultad: 'facil',
    palabras: [
      { palabra: 'PAN', dato: 'El pan tradicional se hace con harina de trigo, por eso siempre hay que buscar la versión sin gluten.' },
      { palabra: 'HARINA', dato: 'No toda harina es igual: la de trigo tiene gluten, pero existen mixes de harinas sin gluten.' },
      { palabra: 'CEBADA', dato: 'La cebada es uno de los tres cereales (junto al trigo y el centeno) que contienen gluten.' },
    ],
    productosIds: ['crackers', 'torradas'],
  },
  {
    id: 3,
    titulo: 'Vivir sin gluten',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 100,
    dificultad: 'medio',
    palabras: [
      { palabra: 'ETIQUETA', dato: 'Leer la etiqueta es clave: buscá siempre el símbolo o la leyenda "sin gluten" (libre de gluten).' },
      { palabra: 'CRUZADA', dato: 'La contaminación cruzada ocurre cuando un alimento sin gluten entra en contacto con otro que sí contiene gluten. Por eso es importante usar utensilios y superficies limpias y separadas.' },
      { palabra: 'SEGURO', dato: 'Un alimento "seguro" es aquel certificado o elaborado sin ningún contacto con gluten.' },
    ],
    productosIds: ['fusilli', 'corn-flakes'],
  },
  {
    id: 4,
    titulo: 'Desafío Schär',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 90,
    dificultad: 'medio',
    palabras: [
      { palabra: 'COOKIES', dato: 'Las Choco Chip Cookies Schär son galletitas sin gluten con chips de chocolate, ideales para la merienda.' },
      { palabra: 'MARIA', dato: 'Las galletitas María Schär vienen en tres porciones individuales y son sin gluten, como las de siempre.' },
      { palabra: 'MERIENDA', dato: 'Una merienda sin gluten puede ser igual de rica que cualquier otra: lo importante es leer la etiqueta.' },
    ],
    productosIds: ['choco-chip-cookies', 'maria'],
  },
  {
    id: 5,
    titulo: 'Mitos y verdades',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 100,
    dificultad: 'dificil',
    palabras: [
      { palabra: 'ALERGIA', dato: 'La celiaquía no es una alergia ni una intolerancia: es una enfermedad autoinmune con base genética.' },
      { palabra: 'GENETICA', dato: 'La celiaquía tiene un componente genético: tener un familiar celíaco aumenta el riesgo de desarrollarla.' },
      { palabra: 'PERMANENTE', dato: 'Una vez diagnosticada, la celiaquía requiere una dieta sin gluten estricta y permanente, de por vida.' },
    ],
    productosIds: ['curvies', 'salinis'],
  },
  {
    id: 6,
    titulo: 'Cocina casera',
    subtitulo: 'Encontrá las 3 palabras escondidas.',
    tiempoSegundos: 100,
    dificultad: 'dificil',
    palabras: [
      { palabra: 'RECETA', dato: 'Adaptar una receta tradicional a sin gluten suele ser más simple de lo que parece: a veces alcanza con cambiar la harina.' },
      { palabra: 'LEVADURA', dato: 'La levadura no tiene gluten, así que se puede usar sin problema en panificados sin gluten.' },
      { palabra: 'UTENSILIOS', dato: 'Usar utensilios y superficies exclusivas para cocinar sin gluten evita la contaminación cruzada en casa.' },
    ],
    productosIds: ['snack', 'wafers'],
  },
]

export function getProductoPorId(id) {
  return PRODUCTOS.find((p) => p.id === id)
}

export function getNivelPorId(id) {
  return NIVELES.find((n) => n.id === id)
}
