import { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import { FilterPanel } from '../components/home/FilterPanel';
import { CategoryTabs } from '../components/home/CategoryTabs';
import { ServiceCard } from '../components/home/ServiceCard';
import { games } from '../data/games';
import { services } from '../data/services';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popular');

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    let result = services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.title.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch);

      return matchesSearch;
    });

    if (category === 'games') {
      result = result.filter((service) =>
        games.some(
          (game) =>
            game.id === service.gameId &&
            game.name.toLowerCase().includes(normalizedSearch),
        ),
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
  }, [search, category, sort]);

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
          Найди нужную игру, услугу или товар среди предложений
          пользователей.
        </p>
      </div>

      <div className="mb-5 relative max-w-2xl">
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
        <FilterPanel
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Найдено предложений: {filteredServices.length}
        </h2>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <h2 className="text-lg font-bold">
            Ничего не найдено
          </h2>

          <p className="mt-2 text-sm text-[#805861]">
            Попробуй изменить поисковый запрос или фильтры.
          </p>
        </div>
      )}
    </div>
  );
}