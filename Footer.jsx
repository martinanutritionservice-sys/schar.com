// Footer reutilizable: una línea chica al pie de pantalla. Se usa en
// Home y en la Alacena, cada vez con su propio texto por props.
export default function Footer({ children }) {
  if (!children) return null
  return <footer className="app-footer">{children}</footer>
}
