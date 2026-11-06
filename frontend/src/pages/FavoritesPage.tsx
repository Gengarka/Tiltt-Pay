import { useEffect, useState } from 'react';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // <-- Импорт контекста

import { ServiceCard } from '../components/home/ServiceCard';
import type { Service } from '../types';

const API_URL = 'http://localhost:3001/api';

function getGameImage(gameName?: string): string {
  const name = (gameName ?? '').toLowerCase();
  if (name.includes('minecraft')) return 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png';
  if (name.includes('genshin')) return 'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg';
  if (name.includes('counter-strike') || name.includes('cs2')) return 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg';
  if (name.includes('dota')) return 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg';
  return '';
}

export function FavoritesPage() {
  const { user, isLoading } = useAuth(); 
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    async function loadFavorites() {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users/${user.id}/favorites`);
        
        if (response.ok) {
          const data = await response.json();
          const normalizedData = data.map((service: any) => ({
            ...service,
            image: service.image || getGameImage(service.gameName),
            rating: Number(service.rating) || 0,
            reviewsCount: Number(service.reviewsCount) || 0,
            price: Number(service.price) || 0,
          }));
          setFavorites(normalizedData);
        }
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [user, isLoading, navigate]);

  if (isLoading || loading) {
    return <div className="py-16 text-center text-[#805861]">Загрузка...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <Link
        to="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] transition hover:text-white"
      >
        <FiArrowLeft /> Вернуться в профиль
      </Link>

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">Личный кабинет</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Избранное</h1>
        <p className="mt-2 text-sm text-[#805861]">Услуги, которые вы сохранили на будущее.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <FiHeart className="mx-auto text-3xl text-[#8e0d24]" />
          <h2 className="mt-4 text-lg font-bold">В избранном пока пусто</h2>
          <p className="mt-2 text-sm text-[#805861]">Добавляйте услуги в избранное, чтобы не потерять их.</p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-[#8e0d24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );
}