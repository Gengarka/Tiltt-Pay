import type { Service } from '../types';

export const services: Service[] = [
  {
    id: 1,
    title: 'Поднятие рейтинга в Dota 2',
    description: 'Помощь с повышением рейтинга и выполнением калибровки.',
    price: 799,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    gameId: 1,
    categoryId: 1,
    sellerId: 1,
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: 2,
    title: 'Помощь с Premier в CS2',
    description: 'Игра вместе с опытным игроком и помощь в матчах.',
    price: 599,
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    gameId: 2,
    categoryId: 2,
    sellerId: 2,
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: 3,
    title: 'Фарм ресурсов в Genshin Impact',
    description: 'Помощь с ежедневными активностями и ресурсами.',
    price: 450,
    image:
      'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg',
    gameId: 3,
    categoryId: 3,
    sellerId: 3,
    rating: 4.7,
    reviewsCount: 76,
  },
  {
    id: 4,
    title: 'Строительство в Minecraft',
    description: 'Создание построек по вашему проекту или описанию.',
    price: 1200,
    image:
      'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
    gameId: 4,
    categoryId: 4,
    sellerId: 4,
    rating: 5,
    reviewsCount: 51,
  },
];