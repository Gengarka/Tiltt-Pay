import { useEffect, useState } from 'react';
import {
  FiChevronRight,
  FiHeart,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiUser,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  balance: number;
  avatar: string | null;
  bio: string | null;
  ordersCount: number;
  favoritesCount: number;
  lastOrder: any | null;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, isLoading: authLoading, logout } = useAuth(); 
  
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      if (!authUser) return; 
      
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/users/${authUser.id}/profile`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [authUser, authLoading, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  if (authLoading || loading) {
    return <div className="text-center py-10 text-[#805861]">Загрузка профиля...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-[#ff8798]">Пользователь не найден.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">Личный кабинет</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Мой профиль</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-3xl border border-[#45101a] bg-[#100305] p-6">
          <div className="text-center">
            <img
              src={profile.avatar || 'https://via.placeholder.com/150'}
              alt="Аватар"
              className="mx-auto h-24 w-24 rounded-full border-2 border-[#8e0d24] object-cover"
            />

            <h2 className="mt-4 text-xl font-bold">{profile.username}</h2>
            <p className="mt-1 text-sm text-[#805861]">{profile.email}</p>

            {profile.bio && (
              <p className="mt-3 px-2 text-sm text-[#c59ca4] italic leading-relaxed">
                "{profile.bio}"
              </p>
            )}

            <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#741324] bg-[#26070e] px-3 py-1 text-xs text-[#ff9aaa]">
              <FiStar />
              Проверенный пользователь
            </div>
          </div>

          <div className="my-6 h-px bg-[#45101a]" />

          <nav className="space-y-1">
            <Link to="/profile" className="flex items-center gap-3 rounded-xl bg-[#8e0d24] px-4 py-3 text-sm font-medium text-white">
              <FiUser /> Профиль
            </Link>
            <Link to="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white">
              <FiPackage /> История заказов
            </Link>
            <Link to="/favorites" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white">
              <FiHeart /> Избранное
            </Link>
            <Link to="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white">
              <FiSettings /> Настройки
            </Link>
          </nav>

          <button type="button" onClick={handleLogout} className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#d86d7e] transition hover:bg-[#2a0710]">
            <FiLogOut /> Выйти
          </button>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-[#5c101e] bg-gradient-to-br from-[#3a0812] to-[#130407] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm text-[#b88b94]">Баланс</p>
                <div className="mt-2 text-4xl font-extrabold">
                  {Number(profile.balance).toLocaleString('ru-RU')} ₽
                </div>
                <p className="mt-2 text-xs text-[#805861]">Доступно для покупок</p>
              </div>
              <Link to="/payment" className="rounded-xl bg-[#8e0d24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]">
                Пополнить
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiShoppingBag className="text-[#e5092f]" />
              <div className="mt-4 text-2xl font-bold">{profile.ordersCount}</div>
              <div className="mt-1 text-sm text-[#805861]">Заказов</div>
            </div>
            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiHeart className="text-[#e5092f]" />
              <div className="mt-4 text-2xl font-bold">{profile.favoritesCount}</div>
              <div className="mt-1 text-sm text-[#805861]">Избранных услуг</div>
            </div>
            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiStar className="text-[#e5092f]" />
              <div className="mt-4 text-2xl font-bold">{profile.ordersCount > 0 ? '4.9' : '0'}</div>
              <div className="mt-1 text-sm text-[#805861]">Средняя оценка</div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#45101a] bg-[#100305]">
            <div className="flex items-center justify-between border-b border-[#45101a] px-6 py-5">
              <div>
                <h2 className="font-bold">Последние заказы</h2>
                <p className="mt-1 text-xs text-[#805861]">Твои последние покупки</p>
              </div>
              <Link to="/orders" className="flex items-center gap-1 text-sm text-[#ff7186] hover:text-white">
                Все заказы <FiChevronRight />
              </Link>
            </div>

            <div className="divide-y divide-[#45101a]">
                           {profile.lastOrder ? (
                <Link to="/orders" className="flex items-center justify-between p-5 hover:bg-[#18050a] transition block">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#26070e] text-[#e5092f]">
                      <FiPackage />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-white">{profile.lastOrder.title}</div>
                        <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                          profile.lastOrder.status === 'Завершён' 
                            ? 'border-[#1d6338] text-[#70d99a]' 
                            : 'border-[#72591c] text-[#e8c96b]'
                        }`}>
                          {profile.lastOrder.status}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-[#805861]">
                        Заказ #{profile.lastOrder.id} • {profile.lastOrder.game} • {new Date(profile.lastOrder.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {Number(profile.lastOrder.price).toLocaleString('ru-RU')} ₽
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FiPackage className="text-3xl text-[#45101a] mb-3" />
                  <p className="text-sm text-[#805861]">
                    У вас пока нет заказов. <br /> 
                    <Link to="/catalog" className="text-[#ff7186] hover:text-white mt-2 inline-block">
                      Перейти в каталог
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}