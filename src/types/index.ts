export interface Game {
  id: number;
  name: string;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  gameId: number;
  categoryId: number;
  sellerId: number;
  rating: number;
  reviewsCount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'seller' | 'admin';
}