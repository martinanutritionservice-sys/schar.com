// Lista lateral de palabras a encontrar. Recibe por props la lista
// completa y cuáles ya se encontraron; no maneja estado propio.
export default function WordList({ palabras, encontradas }) {
  return (
    <ul className="word-list">
      {palabras.map(({ palabra }) => {
        const yaEncontrada = encontradas.includes(palabra)
        return (
          <li key={palabra} className={yaEncontrada ? 'word-list__item word-list__item--encontrada' : 'word-list__item'}>
            {yaEncontrada ? '✓ ' : '• '}
            {palabra}
          </li>
        )
      })}
    </ul>
  )
}
