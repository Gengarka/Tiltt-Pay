import { FiChevronDown, FiSliders } from 'react-icons/fi';

interface FilterPanelProps {
  sort: string;
  onSortChange: (sort: string) => void;
}

export function FilterPanel({
  sort,
  onSortChange,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#45101a] bg-[#100305] p-4">
      <div className="flex items-center gap-2 text-sm text-[#b88b94]">
        <FiSliders />
        Фильтры
      </div>

      <div className="h-5 w-px bg-[#45101a]" />

      <label className="relative">
        <span className="sr-only">Сортировка</span>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="appearance-none rounded-xl border border-[#45101a] bg-[#18050a] py-2.5 pl-3 pr-9 text-sm text-white outline-none focus:border-[#e5092f]"
        >
          <option value="popular">По популярности</option>
          <option value="rating">По рейтингу</option>
          <option value="price-low">Сначала дешевле</option>
          <option value="price-high">Сначала дороже</option>
        </select>

        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9e6b74]" />
      </label>
    </div>
  );
}