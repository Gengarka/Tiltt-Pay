export interface Order {
  id: number;
  serviceId: number;
  title: string;
  game: string;
  price: number;
  date: string;
  status: 'completed' | 'processing' | 'cancelled';
}

export const orders: Order[] = [
  {
    id: 1048,
    serviceId: 1,
    title: 'Поднятие рейтинга в Dota 2',
    game: 'Dota 2',
    price: 799,
    date: '24 сентября 2026',
    status: 'processing',
  },
  {
    id: 1042,
    serviceId: 2,
    title: 'Помощь с Premier в CS2',
    game: 'Counter-Strike 2',
    price: 599,
    date: '23 сентября 2026',
    status: 'completed',
  },
  {
    id: 1037,
    serviceId: 3,
    title: 'Прокачка персонажа',
    game: 'Genshin Impact',
    price: 1290,
    date: '21 сентября 2026',
    status: 'completed',
  },
  {
    id: 1029,
    serviceId: 4,
    title: 'Строительство базы',
    game: 'Minecraft',
    price: 450,
    date: '18 сентября 2026',
    status: 'cancelled',
  },
];