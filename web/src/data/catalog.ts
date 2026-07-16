import type { CatalogRow, Title } from '../types';

const BUCKET = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';

const video = (file: string) => `${BUCKET}/${file}`;
const image = (file: string) => `${BUCKET}/images/${file}`;

/**
 * Demo catalog built from Google's public sample-video bucket
 * (Creative Commons / promotional clips), so the app works out of the box.
 * Swap this file for your real content API when you have one.
 */
export const TITLES: Title[] = [
  {
    id: 'big-buck-bunny',
    name: 'Big Buck Bunny',
    description:
      'A gentle giant rabbit finally stands up to a trio of bullying rodents in this beloved open-source animated short from the Blender Foundation.',
    videoUrl: video('BigBuckBunny.mp4'),
    posterUrl: image('BigBuckBunny.jpg'),
    backdropUrl: image('BigBuckBunny.jpg'),
    year: 2008,
    maturityRating: 'G',
    durationMinutes: 10,
    genres: ['Animation', 'Comedy', 'Family'],
    isOriginal: true,
    trending: true,
  },
  {
    id: 'elephants-dream',
    name: "Elephant's Dream",
    description:
      'Two strangers explore a surreal, ever-shifting machine world — until one of them begins to question whether any of it is real.',
    videoUrl: video('ElephantsDream.mp4'),
    posterUrl: image('ElephantsDream.jpg'),
    backdropUrl: image('ElephantsDream.jpg'),
    year: 2006,
    maturityRating: 'PG',
    durationMinutes: 11,
    genres: ['Animation', 'Sci-Fi', 'Fantasy'],
    isOriginal: true,
  },
  {
    id: 'sintel',
    name: 'Sintel',
    description:
      'A lone warrior crosses frozen mountains and burning deserts searching for the baby dragon she once rescued — and lost.',
    videoUrl: video('Sintel.mp4'),
    posterUrl: image('Sintel.jpg'),
    backdropUrl: image('Sintel.jpg'),
    year: 2010,
    maturityRating: 'PG-13',
    durationMinutes: 15,
    genres: ['Animation', 'Adventure', 'Drama'],
    isOriginal: true,
    trending: true,
  },
  {
    id: 'tears-of-steel',
    name: 'Tears of Steel',
    description:
      'Forty years after a heartbreak in Amsterdam, a group of scientists stages an elaborate reenactment to save the world from vengeful robots.',
    videoUrl: video('TearsOfSteel.mp4'),
    posterUrl: image('TearsOfSteel.jpg'),
    backdropUrl: image('TearsOfSteel.jpg'),
    year: 2012,
    maturityRating: 'PG-13',
    durationMinutes: 12,
    genres: ['Sci-Fi', 'Action', 'Drama'],
    isOriginal: true,
    trending: true,
  },
  {
    id: 'for-bigger-blazes',
    name: 'For Bigger Blazes',
    description:
      'Heat things up on the biggest screen in the house. A fiery showcase of what streaming to your TV can look like.',
    videoUrl: video('ForBiggerBlazes.mp4'),
    posterUrl: image('ForBiggerBlazes.jpg'),
    backdropUrl: image('ForBiggerBlazes.jpg'),
    year: 2013,
    maturityRating: 'G',
    durationMinutes: 1,
    genres: ['Short', 'Showcase'],
  },
  {
    id: 'for-bigger-escapes',
    name: 'For Bigger Escapes',
    description:
      'When you need a getaway, go big. A quick escape into cinematic adventure, made for the living-room screen.',
    videoUrl: video('ForBiggerEscapes.mp4'),
    posterUrl: image('ForBiggerEscapes.jpg'),
    backdropUrl: image('ForBiggerEscapes.jpg'),
    year: 2013,
    maturityRating: 'G',
    durationMinutes: 1,
    genres: ['Short', 'Adventure'],
  },
  {
    id: 'for-bigger-fun',
    name: 'For Bigger Fun',
    description:
      'Everything is more fun when it is bigger. A playful burst of color and motion for the whole family.',
    videoUrl: video('ForBiggerFun.mp4'),
    posterUrl: image('ForBiggerFun.jpg'),
    backdropUrl: image('ForBiggerFun.jpg'),
    year: 2013,
    maturityRating: 'G',
    durationMinutes: 1,
    genres: ['Short', 'Family'],
    trending: true,
  },
  {
    id: 'for-bigger-joyrides',
    name: 'For Bigger Joyrides',
    description:
      'Buckle up for a joyride across sweeping roads and open horizons — short, fast, and full of thrills.',
    videoUrl: video('ForBiggerJoyrides.mp4'),
    posterUrl: image('ForBiggerJoyrides.jpg'),
    backdropUrl: image('ForBiggerJoyrides.jpg'),
    year: 2013,
    maturityRating: 'G',
    durationMinutes: 1,
    genres: ['Short', 'Action'],
  },
  {
    id: 'for-bigger-meltdowns',
    name: 'For Bigger Meltdowns',
    description:
      'Even meltdowns look better on a bigger screen. A tongue-in-cheek short about losing your cool in style.',
    videoUrl: video('ForBiggerMeltdowns.mp4'),
    posterUrl: image('ForBiggerMeltdowns.jpg'),
    backdropUrl: image('ForBiggerMeltdowns.jpg'),
    year: 2013,
    maturityRating: 'PG',
    durationMinutes: 1,
    genres: ['Short', 'Comedy'],
  },
  {
    id: 'subaru-street-dirt',
    name: 'Outback: Street & Dirt',
    description:
      'From city asphalt to mountain trails — a rugged road documentary that never slows down.',
    videoUrl: video('SubaruOutbackOnStreetAndDirt.mp4'),
    posterUrl: image('SubaruOutbackOnStreetAndDirt.jpg'),
    backdropUrl: image('SubaruOutbackOnStreetAndDirt.jpg'),
    year: 2014,
    maturityRating: 'G',
    durationMinutes: 10,
    genres: ['Documentary', 'Cars'],
  },
  {
    id: 'volkswagen-gti-review',
    name: 'GTI: The Review',
    description:
      'An unfiltered look at a hot hatch icon. Every corner, every gear change, every opinion.',
    videoUrl: video('VolkswagenGTIReview.mp4'),
    posterUrl: image('VolkswagenGTIReview.jpg'),
    backdropUrl: image('VolkswagenGTIReview.jpg'),
    year: 2014,
    maturityRating: 'G',
    durationMinutes: 9,
    genres: ['Documentary', 'Cars'],
  },
  {
    id: 'we-are-going-on-bullrun',
    name: 'Going on Bullrun',
    description:
      'A convoy of dreamers takes on the legendary Bullrun rally. High speeds, higher stakes.',
    videoUrl: video('WeAreGoingOnBullrun.mp4'),
    posterUrl: image('WeAreGoingOnBullrun.jpg'),
    backdropUrl: image('WeAreGoingOnBullrun.jpg'),
    year: 2014,
    maturityRating: 'PG',
    durationMinutes: 10,
    genres: ['Documentary', 'Action', 'Cars'],
  },
  {
    id: 'what-car-for-a-grand',
    name: 'A Car for a Grand',
    description:
      'What can a thousand bucks really buy? A scrappy hunt through the used-car jungle.',
    videoUrl: video('WhatCarCanYouGetForAGrand.mp4'),
    posterUrl: image('WhatCarCanYouGetForAGrand.jpg'),
    backdropUrl: image('WhatCarCanYouGetForAGrand.jpg'),
    year: 2014,
    maturityRating: 'PG',
    durationMinutes: 9,
    genres: ['Documentary', 'Comedy', 'Cars'],
  },
];

export const HERO_TITLE_ID = 'sintel';

export const CATALOG_ROWS: CatalogRow[] = [
  {
    id: 'trending',
    label: 'Trending Now',
    titleIds: ['sintel', 'tears-of-steel', 'big-buck-bunny', 'for-bigger-fun', 'we-are-going-on-bullrun'],
  },
  {
    id: 'originals',
    label: 'N Originals',
    titleIds: ['big-buck-bunny', 'elephants-dream', 'sintel', 'tears-of-steel'],
  },
  {
    id: 'animation',
    label: 'Animation',
    titleIds: ['big-buck-bunny', 'elephants-dream', 'sintel'],
  },
  {
    id: 'action',
    label: 'Action & Adventure',
    titleIds: ['tears-of-steel', 'for-bigger-joyrides', 'we-are-going-on-bullrun', 'for-bigger-escapes'],
  },
  {
    id: 'docs',
    label: 'Documentaries',
    titleIds: ['subaru-street-dirt', 'volkswagen-gti-review', 'we-are-going-on-bullrun', 'what-car-for-a-grand'],
  },
  {
    id: 'shorts',
    label: 'Quick Watches',
    titleIds: [
      'for-bigger-blazes',
      'for-bigger-escapes',
      'for-bigger-fun',
      'for-bigger-joyrides',
      'for-bigger-meltdowns',
    ],
  },
];

export function getTitle(id: string): Title | undefined {
  return TITLES.find((t) => t.id === id);
}

export function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TITLES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)) ||
      t.description.toLowerCase().includes(q)
  );
}
