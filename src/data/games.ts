import type { Game } from '../types';

export const games: Game[] = [
  {
    id: 1,
    name: 'Dota 2',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    category: 'MOBA',
  },
  {
    id: 2,
    name: 'Counter-Strike 2',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    category: 'Шутер',
  },
  {
    id: 3,
    name: 'Genshin Impact',
    image:
      'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg',
    category: 'RPG',
  },
  {
    id: 4,
    name: 'Minecraft',
    image:
      'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
    category: 'Песочница',
  },
];