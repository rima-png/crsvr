/**
 * Landmark photos for each covered country, displayed inside the
 * CountryPolaroid component on step 3.
 *
 * Source: Wikimedia Commons, downloaded once and self-hosted at
 * /public/landmarks/{ISO2}.jpg. Various Creative Commons licences apply
 * to the originals; the mapping here records the descriptive subject
 * for alt text and the source URL for reference.
 *
 * To replace an image: drop a new file at /public/landmarks/{ISO2}.jpg
 * and update the entry here.
 */

export interface Landmark {
  /** Public path served by Next.js from /public/. */
  src: string
  /** Concise human description of the photo subject. Used as alt text. */
  alt: string
  /** Short name of the landmark for any caption use. */
  name: string
}

const fallback: Landmark = {
  src: '',
  alt: '',
  name: '',
}

const LANDMARKS: Record<string, Landmark> = {
  AE: { src: '/landmarks/AE.jpg', alt: 'Burj Khalifa rising above the Dubai skyline', name: 'Burj Khalifa' },
  AR: { src: '/landmarks/AR.jpg', alt: 'Obelisk of Buenos Aires at Plaza de la República', name: 'Obelisco de Buenos Aires' },
  AT: { src: '/landmarks/AT.jpg', alt: 'Schönbrunn Palace in Vienna', name: 'Schönbrunn Palace' },
  AU: { src: '/landmarks/AU.jpg', alt: 'Sydney harbour with the Opera House and Harbour Bridge', name: 'Sydney Harbour' },
  BE: { src: '/landmarks/BE.jpg', alt: 'The Atomium sculpture in Brussels', name: 'Atomium' },
  BR: { src: '/landmarks/BR.jpg', alt: 'Christ the Redeemer statue overlooking Rio de Janeiro', name: 'Christ the Redeemer' },
  CA: { src: '/landmarks/CA.jpg', alt: 'Niagara Falls', name: 'Niagara Falls' },
  CH: { src: '/landmarks/CH.jpg', alt: 'The Matterhorn in the Swiss Alps', name: 'Matterhorn' },
  CO: { src: '/landmarks/CO.jpg', alt: 'The walled old town of Cartagena', name: 'Cartagena de Indias' },
  CZ: { src: '/landmarks/CZ.jpg', alt: 'Charles Bridge spanning the Vltava in Prague', name: 'Charles Bridge' },
  DE: { src: '/landmarks/DE.jpg', alt: 'Brandenburg Gate in Berlin at dusk', name: 'Brandenburg Gate' },
  DK: { src: '/landmarks/DK.jpg', alt: 'The colourful Nyhavn waterfront in Copenhagen', name: 'Nyhavn' },
  ES: { src: '/landmarks/ES.jpg', alt: 'La Sagrada Família in Barcelona', name: 'Sagrada Família' },
  FR: { src: '/landmarks/FR.jpg', alt: 'The Eiffel Tower in Paris', name: 'Eiffel Tower' },
  GB: { src: '/landmarks/GB.jpg', alt: 'The Elizabeth Tower and Big Ben in London', name: 'Big Ben' },
  HK: { src: '/landmarks/HK.jpg', alt: 'Hong Kong skyline from Victoria Peak', name: 'Victoria Harbour' },
  IE: { src: '/landmarks/IE.jpg', alt: 'The Cliffs of Moher on the Atlantic coast of Ireland', name: 'Cliffs of Moher' },
  IL: { src: '/landmarks/IL.jpg', alt: 'The Western Wall in Jerusalem', name: 'Western Wall' },
  IN: { src: '/landmarks/IN.jpg', alt: 'The Taj Mahal in Agra', name: 'Taj Mahal' },
  IT: { src: '/landmarks/IT.jpg', alt: 'The Colosseum in Rome', name: 'Colosseum' },
  JP: { src: '/landmarks/JP.jpg', alt: 'Mount Fuji at sunrise', name: 'Mount Fuji' },
  KE: { src: '/landmarks/KE.jpg', alt: 'Mount Kenya', name: 'Mount Kenya' },
  KR: { src: '/landmarks/KR.jpg', alt: 'Gwanghwamun gate at Gyeongbokgung Palace, Seoul', name: 'Gwanghwamun' },
  MX: { src: '/landmarks/MX.jpg', alt: 'El Castillo pyramid at Chichén Itzá', name: 'Chichén Itzá' },
  MY: { src: '/landmarks/MY.jpg', alt: 'The Petronas Twin Towers in Kuala Lumpur', name: 'Petronas Towers' },
  NL: { src: '/landmarks/NL.jpg', alt: 'Windmills at Kinderdijk', name: 'Kinderdijk' },
  NZ: { src: '/landmarks/NZ.jpg', alt: 'Aoraki / Mount Cook in the Southern Alps', name: 'Aoraki / Mount Cook' },
  PL: { src: '/landmarks/PL.jpg', alt: 'Wawel Royal Castle in Kraków', name: 'Wawel Castle' },
  PT: { src: '/landmarks/PT.jpg', alt: 'Belém Tower on the Tagus river in Lisbon', name: 'Belém Tower' },
  RO: { src: '/landmarks/RO.jpg', alt: 'Palace of the Parliament in Bucharest', name: 'Palace of the Parliament' },
  SE: { src: '/landmarks/SE.jpg', alt: 'Stockholm City Hall on Lake Mälaren', name: 'Stadshuset' },
  SG: { src: '/landmarks/SG.jpg', alt: 'Marina Bay Sands in Singapore', name: 'Marina Bay Sands' },
  TR: { src: '/landmarks/TR.jpg', alt: 'Hagia Sophia in Istanbul', name: 'Hagia Sophia' },
  US: { src: '/landmarks/US.jpg', alt: 'Statue of Liberty in New York Harbor', name: 'Statue of Liberty' },
  ZA: { src: '/landmarks/ZA.jpg', alt: 'Table Mountain above Cape Town', name: 'Table Mountain' },
}

/**
 * Returns the landmark photo metadata for an ISO2 country code, or a
 * blank fallback if no image is curated for that code.
 */
export function getLandmark(code: string): Landmark {
  return LANDMARKS[code.toUpperCase()] ?? fallback
}
