function PlanetIcon({ ringed = false }) {
  return (
    <svg
      className="planet-breadcrumb-icon"
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
    >
      {ringed && (
        <ellipse
          className="planet-icon-ring"
          cx="16"
          cy="16"
          rx="14"
          ry="5"
          transform="rotate(-18 16 16)"
        />
      )}
      <circle className="planet-icon-body" cx="16" cy="16" r="6.5" />
    </svg>
  )
}

export function PlanetBreadcrumbs({
  planets,
  activePlanetId,
  isSystemActive = false,
  onSelect,
  onSystemSelect,
}) {
  return (
    <nav className="planet-breadcrumbs" aria-label="Navigation entre les planètes">
      <button
        type="button"
        className={`breadcrumb-label ${isSystemActive ? 'is-active' : ''}`}
        onClick={(event) => {
          event.stopPropagation()
          onSystemSelect()
        }}
        onPointerDown={(event) => event.stopPropagation()}
        aria-current={isSystemActive ? 'page' : undefined}
        aria-label="Afficher le système solaire"
      >
        Système solaire
      </button>
      <ol>
        {planets.map((planet, index) => {
          const isActive = planet.id === activePlanetId

          return (
            <li key={planet.id}>
              <button
                type="button"
                className={`planet-breadcrumb ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelect(planet.id)}
                aria-current={isActive ? 'page' : undefined}
                title={`Explorer ${planet.name}`}
              >
                <span className="breadcrumb-number">
                  {planet.displayNumber ?? String(index).padStart(2, '0')}
                </span>
                <PlanetIcon ringed={Boolean(planet.ring)} />
                <span className="breadcrumb-name">{planet.name}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
