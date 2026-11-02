export default function LivesIndicator({ vidas, vidasMax = 3 }) {
  return (
    <div className="lives-indicator" aria-label={`${vidas} vidas restantes`}>
      {Array.from({ length: vidasMax }).map((_, i) => (
        <span key={i} className={`lives-indicator__heart${i < vidas ? '' : ' lives-indicator__heart--vacio'}`}>
          ❤
        </span>
      ))}
    </div>
  )
}
