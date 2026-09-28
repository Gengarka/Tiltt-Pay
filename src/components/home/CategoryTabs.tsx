import { FiGrid, FiMonitor, FiShield, FiShoppingBag } from 'react-icons/fi';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  {
    id: 'all',
    label: 'Все',
    icon: FiGrid,
  },
  {
    id: 'games',
    label: 'Игры',
    icon: FiMonitor,
  },
  {
    id: 'services',
    label: 'Услуги',
    icon: FiShield,
  },
  {
    id: 'items',
    label: 'Товары',
    icon: FiShoppingBag,
  },
];

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-[#8e0d24] text-white'
                : 'border border-[#45101a] bg-[#130407] text-[#b88b94] hover:bg-[#26070e] hover:text-white'
            }`}
          >
            <Icon />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}