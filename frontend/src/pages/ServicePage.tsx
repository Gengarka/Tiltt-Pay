import { useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiHeart,
  FiStar,
} from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import type { Service } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  author: string;
  avatar: string | null;
}

function getGameImage(gameName?: string): string {
  const name = (gameName ?? '').toLowerCase();
  if (name.includes('apex')) return '/images/games/apex.webp';
  if (name.includes('counter-strike') || name.includes('cs2')) return '/images/games/cs2.webp';
  if (name.includes('dota')) return '/images/games/dota.jpg';
  if (name.includes('fortnite')) return '/images/games/fortnite.webp';
  if (name.includes('genshin')) return '/images/games/genshin.jpg';
  if (name.includes('gta')) return '/images/games/gta v.webp';
  if (name.includes('minecraft')) return '/images/games/minecraft.jpg';
  if (name.includes('pubg')) return '/images/games/pubg.webp';
  if (name.includes('roblox')) return '/images/games/roblox.webp';
  if (name.includes('valorant')) return '/images/games/valorant.webp';
  if (name.includes('world of tanks') || name.includes('wot')) return '/images/games/wot.webp';
  return 'https://via.placeholder.com/400x200?text=Game';
}

export function ServicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFavorite, setIsFavorite] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasBought, setHasBought] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const serviceRes = await fetch(`${API_URL}/services/${id}`);
        if (!serviceRes.ok) throw new Error('Услуга не найдена');
        const serviceData = await serviceRes.json();
        setService({ ...serviceData, price: Number(serviceData.price) });

        const reviewsRes = await fetch(`${API_URL}/services/${id}/reviews`);
        if (!reviewsRes.ok) {
          const reviewsData = await reviewsRes.json().catch(() => ({}));
          setReviewError(reviewsData.error || 'Не удалось загрузить отзывы');
        } else {
          setReviews(await reviewsRes.json());
          setReviewError('');
        }

        if (user) {
          const ordersRes = await fetch(`${API_URL}/orders/user/${user.id}`);
          if (ordersRes.ok) {
            const orders = await ordersRes.json();
            const boughtOrder = orders.find((o: any) => o.serviceId === Number(id) && o.status === 'Завершён');
            if (boughtOrder) {
              setHasBought(true);
              setOrderId(boughtOrder.id);
            }
          }
        }

      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadData();
  }, [id, user]);

  useEffect(() => {
    if (user && service) {
      fetch(`${API_URL}/users/${user.id}/favorites`)
        .then(res => res.json())
        .then(favs => {
          setIsFavorite(favs.some((f: any) => f.id === service.id));
        })
        .catch(err => console.error(err));
    }
  }, [user, service]);

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    if (!service) return;

    try {
      if (isFavorite) {
        await fetch(`${API_URL}/users/${user.id}/favorites/${service.id}`, { method: 'DELETE' });
        setIsFavorite(false);
      } else {
        await fetch(`${API_URL}/users/${user.id}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceId: service.id })
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orderId) return;

    try {
      setReviewLoading(true);
       const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          authorId: user.id,
          rating,
          comment: comment
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки');

      alert('Отзыв успешно добавлен!');
      setComment('');
      setHasBought(false);

      const reviewsRes = await fetch(`${API_URL}/services/${id}/reviews`);
      if (!reviewsRes.ok) {
        throw new Error('Отзыв сохранён, но список отзывов не удалось обновить');
      }
      setReviews(await reviewsRes.json());

      const serviceRes = await fetch(`${API_URL}/services/${id}`);
      if (serviceRes.ok) {
        const serviceData = await serviceRes.json();
        setService({ ...serviceData, price: Number(serviceData.price) });
      } 

    } catch (err: any) {
      alert(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#805861]">Загрузка...</div>;
  if (error || !service) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Услуга не найдена</h1>
        <Link to="/catalog" className="mt-4 text-[#ff7186]">Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      <Link to="/catalog" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white">
        <FiArrowLeft /> Вернуться в каталог
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-[#45101a] bg-[#100305]">
            <div className="aspect-video overflow-hidden bg-[#23070d]">
              <img
                src={service.image || getGameImage(service.gameName)}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#741324] bg-[#26070e] px-3 py-1 text-xs text-[#ff9aaa]">
                  {service.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-[#d9aeb6]">
                  <FiStar className="fill-current text-[#ffb000]" /> {Number(service.rating).toFixed(1)}
                </span>
                <span className="text-sm text-[#805861]">{service.reviewsCount} отзывов</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">{service.title}</h1>
              <p className="mt-5 text-sm leading-7 text-[#b88b94]">{service.description}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6">
            <h2 className="font-bold text-lg mb-4">Отзывы ({reviews.length})</h2>
            
            {hasBought && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 rounded-xl border border-[#741324] bg-[#26070e]">
                <p className="text-sm font-bold text-white mb-2">Оставить отзыв</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      <FiStar className={`text-2xl ${star <= rating ? 'fill-[#ffb000] text-[#ffb000]' : 'text-[#805861]'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Расскажите о вашем опыте..."
                  rows={3}
                  className="w-full rounded-xl border border-[#45101a] bg-[#18050a] p-3 text-sm text-white outline-none focus:border-[#e5092f] resize-none mb-3"
                />
                <button type="submit" disabled={reviewLoading} className="rounded-lg bg-[#8e0d24] px-4 py-2 text-sm font-bold text-white hover:bg-[#e5092f]">
                  {reviewLoading ? 'Отправка...' : 'Отправить отзыв'}
                </button>
                {reviewError && (
                  <p className="mt-3 text-sm text-red-400">
                     {reviewError}
                  </p>
                )}
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-sm text-[#805861]">Пока нет отзывов. Будьте первым!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-[#45101a] bg-[#18050a]">
                    <div className="flex items-start gap-3">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={`Аватар ${rev.author}`}
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#26070e] text-sm font-bold text-[#e5092f]">
                          {rev.author ? rev.author[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-white">{rev.author || 'Пользователь'}</span>
                          <span className="text-xs text-[#805861]">{new Date(rev.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                        
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star} 
                              size={12} 
                              className={star <= rev.rating ? 'fill-[#ffb000] text-[#ffb000]' : 'text-[#45101a]'} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-sm text-[#b88b94]">{rev.comment || 'Без комментария'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-[#45101a] bg-[#100305] p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#805861]">Стоимость услуги</span>
            <button onClick={toggleFavorite} className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#45101a] transition hover:border-[#8e0d24] hover:text-[#ff7186] ${isFavorite ? 'text-[#ff7186]' : 'text-[#b88b94]'}`}>
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="mt-2 text-3xl font-extrabold">{service.price.toLocaleString('ru-RU')} ₽</div>
          
          <Link to={`/checkout/${service.id}`} className="block mt-6 w-full">
            <Button className="w-full">Купить услугу</Button>
          </Link>

          <div className="my-6 h-px bg-[#45101a]" />
          <div className="text-xs uppercase tracking-wider text-[#805861]">Исполнитель</div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#26070e] text-[#e5092f]">
              <FiCheckCircle />
            </div>
            <div>
              <div className="font-semibold">{service.sellerName || 'Продавец'}</div>
              <div className="mt-1 text-xs text-[#805861]">Проверенный продавец</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}