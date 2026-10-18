export function PlanetInfo({ planet }) {
  return (
    <section className="planet-info" aria-live="polite">
      <div className="planet-header">
        <p className="planet-index">
          {planet.displayNumber} / 08
        </p>
        <h1>{planet.name}</h1>
        <p className="planet-subtitle">{planet.subtitle}</p>
      </div>
      <div className="planet-details">
        <p className="planet-description">{planet.description}</p>
        <dl className="planet-facts">
          {planet.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
