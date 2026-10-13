
import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { FilterPanel } from '../components/home/FilterPanel';
import { CategoryTabs } from '../components/home/CategoryTabs';
import { ServiceCard } from '../components/home/ServiceCard';
import type { Service } from '../types';

const API_URL = 'http://localhost:3001/api/services';

function getGameImage(gameName?: string): string {
  const name = (gameName ?? '').toLowerCase();

  if (name.includes('minecraft')) {
    return 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png';
  }

  if (name.includes('genshin')) {
    return 'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg';
  }

  if (name.includes('counter-strike') || name.includes('cs2')) {
    return 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg';
  }

  if (name.includes('dota')) {
    return 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg';
  }

  return '';
}

export function CatalogPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data: Service[] = await response.json();

        const normalizedServices = data.map((service) => ({
          ...service,
          image: service.image || getGameImage(service.gameName),
          rating: Number(service.rating) || 0,
          reviewsCount: Number(service.reviewsCount) || 0,
          price: Number(service.price) || 0,
        }));

        setServices(normalizedServices);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.error('Не удалось загрузить услуги:', err);
        setError(
          'Не удалось загрузить каталог. Проверь, запущен ли backend.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => controller.abort();
  }, []);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    let result = services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.title.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch) ||
        (service.gameName ?? '').toLowerCase().includes(normalizedSearch);

      return matchesSearch;
    });

    if (category === 'games') {
      result = result.filter((service) =>
        (service.gameName ?? '').toLowerCase().includes(normalizedSearch),
      );
    }

    if (category === 'services') {
      result = result.filter((service) => service.id > 0);
    }

    if (sort === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    if (sort === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, category, sort]);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">
          Каталог
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Игры и услуги
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#805861]">
          Найди нужную игру, услугу или товар среди предложений пользователей.
        </p>
      </div>

      <div className="relative mb-5 max-w-2xl">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d5b64]" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="search"
          placeholder="Поиск по каталогу..."
          className="h-12 w-full rounded-xl border border-[#4d101b] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#8b5d65] focus:border-[#e5092f]"
        />
      </div>

      <div className="mb-5">
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      <div className="mb-7">
        <FilterPanel sort={sort} onSortChange={setSort} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Найдено предложений: {filteredServices.length}
        </h2>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#805861]">
          Загружаем услуги из базы данных...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <h2 className="text-lg font-bold">Не удалось загрузить каталог</h2>
          <p className="mt-2 text-sm text-[#805861]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-[#e5092f] px-5 py-2 text-sm font-semibold text-white"
          >
            Повторить
          </button>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <h2 className="text-lg font-bold">Ничего не найдено</h2>
          <p className="mt-2 text-sm text-[#805861]">
            Попробуй изменить поисковый запрос или фильтры.
          </p>
        </div>
      )}
    </div>
  );
}