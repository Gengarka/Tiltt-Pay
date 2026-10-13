import {
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiSettings,
  FiShoppingBag,
} from 'react-icons/fi';
import { NavLink, Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Footer } from './Footer';

const navigationItems = [
  {
    to: '/',
    label: 'Главная',
    icon: FiHome,
  },
  {
    to: '/catalog',
    label: 'Каталог',
    icon: FiGrid,
  },
  {
    to: '/login',
    label: 'Мои покупки',
    icon: FiShoppingBag,
  },
  {
    to: '/login',
    label: 'Избранное',
    icon: FiHeart,
  },
  {
    to: '/login',
    label: 'Кошелёк',
    icon: FiShoppingBag,
  },
  {
    to: '/login',
    label: 'Поддержка',
    icon: FiHelpCircle,
  },
  {
    to: '/login',
    label: 'Настройки',
    icon: FiSettings,
  },
];

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080304] text-white">
      <Header />

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-[#45101a] bg-[#100305] p-4 lg:block">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-[#8e0d24] text-white'
                        : 'text-[#c59ca4] hover:bg-[#26070e] hover:text-white'
                    }`
                  }
                >
                  <Icon />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#5c101e] bg-[#18050a] p-4">
            <div className="mb-2 text-sm font-bold">
              Тильт-платёж
            </div>

            <div className="text-xs text-[#9b6a73]">
              Быстро. Безопасно. Выгодно.
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}