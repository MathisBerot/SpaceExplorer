const content = [
  {
    eyebrow: 'Une exploration immersive',
    title: 'Space Explorer',
    description: 'Explorer le système solaire n’a jamais été aussi simple et immersif',
  },
  {
    title: 'Le système solaire',
    description:
      'Une étoile, huit planètes, des centaines de lunes et une multitude de corps célestes, tous liés par la gravité. Formé il y a environ 4,6 milliards d’années, notre Système solaire s’étend au cœur de la Voie lactée.',
  },
]

export function IntroContent({ phase }) {
  const current = content[phase]

  return (
    <section className={`intro-content intro-content--phase-${phase}`}>
      <p className="intro-eyebrow">{current.eyebrow}</p>
      <h1>{current.title}</h1>
      <p className="intro-description">{current.description}</p>
      {current.facts && (
        <dl className="intro-facts">
          {current.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
