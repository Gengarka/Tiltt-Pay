import { FiArrowRight, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { GameCard } from '../components/home/GameCard';
import { ServiceCard } from '../components/home/ServiceCard';
import { Button } from '../components/ui/Button';
import { games } from '../data/games';
import { services } from '../data/services';

export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-[#5c101e] bg-gradient-to-br from-[#3a0812] via-[#18050a] to-[#0d0305] p-7 sm:p-10 lg:p-14">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#741324] bg-[#26070e] px-3 py-1.5 text-xs font-medium text-[#ff9aaa]">
            <FiZap />
            Игровой маркетплейс
          </div>

          <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Игры, услуги и{' '}
            <span className="text-[#e5092f]">всё для гейминга</span>
          </h1>

          <p className="mb-7 max-w-xl text-sm leading-6 text-[#c59ca4] sm:text-base">
            Покупай игровые услуги у проверенных исполнителей,
            находи нужные товары и получай всё быстро и удобно.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/catalog">
              <Button>
                Перейти в каталог
                <FiArrowRight className="ml-2 inline" />
              </Button>
            </Link>

            <Button variant="secondary">
              Стать продавцом
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e5092f]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-[#8e0d24]/20 blur-3xl" />
      </section>

      <section className="mb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Популярные игры</h2>

            <p className="mt-1 text-sm text-[#805861]">
              Выбирай игру и находи нужные услуги
            </p>
          </div>

          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium text-[#ff7186] hover:text-white sm:flex"
          >
            Все игры
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="pb-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Популярные услуги</h2>

            <p className="mt-1 text-sm text-[#805861]">
              То, что сейчас чаще всего выбирают пользователи
            </p>
          </div>

          <Link
            to="/catalog"
            className="hidden items-center gap-1 text-sm font-medium text-[#ff7186] hover:text-white sm:flex"
          >
            Смотреть всё
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}