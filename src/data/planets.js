const textureRoot =
  'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images'

const sharedPosition = (index) => [3.8, 0, -index * 30]
const displayRadius = 1.6

export const sun = {
  id: 'sun',
  name: 'Soleil',
  subtitle: 'Notre étoile',
  description:
    'Une étoile naine jaune au centre du système solaire, dont l’énergie rend la vie possible sur Terre.',
  facts: [
    ['Température de surface', '5 500 °C'],
    ['Température du cœur', '15 M °C'],
    ['Distance de la Terre', '149,6 M km'],
    ['Diamètre', '1,392 M km'],
    ['Âge', '4,6 milliards d’années'],
  ],
  texture:
    'https://upload.wikimedia.org/wikipedia/commons/9/99/Map_of_the_full_sun.jpg',
  position: [3.8, 0, 30],
  radius: displayRadius,
  isStar: true,
  displayNumber: '00',
}

const planetData = [
  {
    id: 'earth',
    name: 'Terre',
    subtitle: 'Notre monde bleu',
    description:
      "Une planète vivante recouverte à 71 % d'océans, où l'eau liquide et une atmosphère riche rendent la vie possible.",
    facts: [
      ['Température moyenne', '15 °C'],
      ['Distance du Soleil', '149,6 M km'],
      ['Diamètre', '12 742 km'],
      ['Durée d’un jour', '23 h 56 min'],
      ['Durée d’une année', '365,25 jours'],
    ],
    texture:
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    bumpMap:
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    orbitalPeriod: 1,
    radius: displayRadius,
  },
  {
    id: 'venus',
    name: 'Vénus',
    subtitle: 'Le monde des nuages',
    description:
      'Une planète rocheuse enveloppée de nuages épais, avec une atmosphère dense et la surface la plus chaude du système solaire.',
    facts: [
      ['Température moyenne', '462 °C'],
      ['Distance du Soleil', '108,2 M km'],
      ['Diamètre', '12 104 km'],
      ['Durée d’un jour', '243 jours'],
      ['Durée d’une année', '224,7 jours'],
    ],
    texture: `${textureRoot}/venusmap.jpg`,
    orbitalPeriod: 0.615,
    radius: displayRadius,
  },
  {
    id: 'mercury',
    name: 'Mercure',
    subtitle: 'La planète la plus proche du soleil',
    description:
      'Un petit monde rocheux aux cratères nombreux, marqué par de très grands écarts de température entre le jour et la nuit.',
    facts: [
      ['Température moyenne', '167 °C'],
      ['Distance du Soleil', '57,9 M km'],
      ['Diamètre', '4 879 km'],
      ['Durée d’un jour', '58,6 jours'],
      ['Durée d’une année', '88 jours'],
    ],
    texture: `${textureRoot}/mercurymap.jpg`,
    orbitalPeriod: 0.241,
    radius: displayRadius,
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'La planète rouge',
    description:
      'Un désert froid et poussiéreux dont la surface conserve les traces d’anciens cours d’eau et de volcans géants.',
    facts: [
      ['Température moyenne', '-63 °C'],
      ['Distance du Soleil', '227,9 M km'],
      ['Diamètre', '6 779 km'],
      ['Durée d’un jour', '24 h 37 min'],
      ['Durée d’une année', '687 jours'],
    ],
    texture: `${textureRoot}/marsmap1k.jpg`,
    orbitalPeriod: 1.881,
    radius: displayRadius,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'La géante gazeuse',
    description:
      'La plus grande planète du système solaire, reconnaissable à ses bandes nuageuses et à sa célèbre Grande Tache rouge.',
    facts: [
      ['Température moyenne', '-110 °C'],
      ['Distance du Soleil', '778,5 M km'],
      ['Diamètre', '139 820 km'],
      ['Durée d’un jour', '9 h 56 min'],
      ['Durée d’une année', '11,86 ans'],
    ],
    texture: `${textureRoot}/jupitermap.jpg`,
    orbitalPeriod: 11.86,
    radius: displayRadius,
  },
  {
    id: 'saturn',
    name: 'Saturne',
    subtitle: 'La planète aux anneaux',
    description:
      'Une géante gazeuse entourée d’un vaste système d’anneaux composé principalement de glace et de poussière.',
    facts: [
      ['Température moyenne', '-140 °C'],
      ['Distance du Soleil', '1,43 Md km'],
      ['Diamètre', '116 460 km'],
      ['Durée d’un jour', '10 h 42 min'],
      ['Durée d’une année', '29,45 ans'],
    ],
    texture: `${textureRoot}/saturnmap.jpg`,
    orbitalPeriod: 29.45,
    radius: displayRadius,
    ring: true,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'La géante glacée',
    description:
      'Une planète bleu-vert qui tourne presque couchée sur son orbite, enveloppée de brumes glacées de méthane.',
    facts: [
      ['Température moyenne', '-195 °C'],
      ['Distance du Soleil', '2,87 Md km'],
      ['Diamètre', '50 724 km'],
      ['Durée d’un jour', '17 h 14 min'],
      ['Durée d’une année', '84 ans'],
    ],
    texture: `${textureRoot}/uranusmap.jpg`,
    orbitalPeriod: 84,
    radius: displayRadius,
    ring: true,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'Le monde des vents',
    description:
      'La planète la plus éloignée du Soleil, balayée par les vents les plus rapides connus du système solaire.',
    facts: [
      ['Température moyenne', '-200 °C'],
      ['Distance du Soleil', '4,50 Md km'],
      ['Diamètre', '49 244 km'],
      ['Durée d’un jour', '16 h 6 min'],
      ['Durée d’une année', '164,8 ans'],
    ],
    texture: `${textureRoot}/neptunemap.jpg`,
    orbitalPeriod: 164.8,
    radius: displayRadius,
  },
]

const orbitalOrder = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
]

export const planets = orbitalOrder.map((id, index) => ({
  ...planetData.find((planet) => planet.id === id),
  position: sharedPosition(index),
  displayNumber: String(index + 1).padStart(2, '0'),
}))

export const celestialBodies = [sun, ...planets]
