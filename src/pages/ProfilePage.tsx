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

import { users } from '../data/users';

export function ProfilePage() {
  const navigate = useNavigate();

  const user = users[0];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">
          Личный кабинет
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Мой профиль
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        
        <aside className="h-fit rounded-3xl border border-[#45101a] bg-[#100305] p-6">
          <div className="text-center">
            <img
              src={user.avatar}
              alt=""
              className="mx-auto h-24 w-24 rounded-full border-2 border-[#8e0d24] object-cover"
            />

            <h2 className="mt-4 text-xl font-bold">
              {user.username}
            </h2>

            <p className="mt-1 text-sm text-[#805861]">
              {user.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#741324] bg-[#26070e] px-3 py-1 text-xs text-[#ff9aaa]">
              <FiStar />
              Проверенный пользователь
            </div>
          </div>

          <div className="my-6 h-px bg-[#45101a]" />

          <nav className="space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl bg-[#8e0d24] px-4 py-3 text-sm font-medium text-white"
            >
              <FiUser />
              Профиль
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white"
            >
              <FiPackage />
              История заказов
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white"
            >
              <FiHeart />
              Избранное
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#b88b94] transition hover:bg-[#26070e] hover:text-white"
            >
              <FiSettings />
              Настройки
            </Link>
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#d86d7e] transition hover:bg-[#2a0710]"
          >
            <FiLogOut />
            Выйти
          </button>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-[#5c101e] bg-gradient-to-br from-[#3a0812] to-[#130407] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm text-[#b88b94]">
                  Баланс
                </p>

                <div className="mt-2 text-4xl font-extrabold">
                  12 450 ₽
                </div>

                <p className="mt-2 text-xs text-[#805861]">
                  Доступно для покупок
                </p>
              </div>

              <Link
                to="/payment"
                className="rounded-xl bg-[#8e0d24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]"
              >
                Пополнить
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiShoppingBag className="text-[#e5092f]" />

              <div className="mt-4 text-2xl font-bold">
                12
              </div>

              <div className="mt-1 text-sm text-[#805861]">
                Заказов
              </div>
            </div>

            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiHeart className="text-[#e5092f]" />

              <div className="mt-4 text-2xl font-bold">
                8
              </div>

              <div className="mt-1 text-sm text-[#805861]">
                Избранных услуг
              </div>
            </div>

            <div className="rounded-2xl border border-[#45101a] bg-[#100305] p-5">
              <FiStar className="text-[#e5092f]" />

              <div className="mt-4 text-2xl font-bold">
                4.9
              </div>

              <div className="mt-1 text-sm text-[#805861]">
                Средняя оценка
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#45101a] bg-[#100305]">
            <div className="flex items-center justify-between border-b border-[#45101a] px-6 py-5">
              <div>
                <h2 className="font-bold">
                  Последние заказы
                </h2>

                <p className="mt-1 text-xs text-[#805861]">
                  Твои последние покупки
                </p>
              </div>

              <Link
                to="/orders"
                className="flex items-center gap-1 text-sm text-[#ff7186] hover:text-white"
              >
                Все заказы
                <FiChevronRight />
              </Link>
            </div>

            <div className="divide-y divide-[#45101a]">
              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#26070e] text-[#e5092f]">
                    <FiPackage />
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      Поднятие рейтинга в Dota 2
                    </div>

                    <div className="mt-1 text-xs text-[#805861]">
                      Заказ #1048 · Сегодня
                    </div>
                  </div>
                </div>

                <span className="hidden text-sm font-semibold sm:block">
                  799 ₽
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#26070e] text-[#e5092f]">
                    <FiPackage />
                  </div>

                  <div>
                    <div className="text-sm font-semibold">
                      Помощь с Premier в CS2
                    </div>

                    <div className="mt-1 text-xs text-[#805861]">
                      Заказ #1042 · Вчера
                    </div>
                  </div>
                </div>

                <span className="hidden text-sm font-semibold sm:block">
                  599 ₽
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}