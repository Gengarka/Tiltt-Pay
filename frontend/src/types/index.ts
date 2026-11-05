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
  gameId: number;
  sellerId: number;
  category?: string;
  gameName?: string;
  sellerName?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  categoryId: number;  
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'seller' | 'admin';
}