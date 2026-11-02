// Componente reutilizable: se usa en las 12 pantallas con distintas
// combinaciones de texto, color y acción (todo llega por props).
export default function Button({ children, onClick, variant = 'primary', fullWidth = true, disabled = false }) {
  return (
    <button
      className={`btn btn-${variant}${fullWidth ? ' btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}
