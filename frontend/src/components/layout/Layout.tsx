import { useState } from 'react';
import {
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiSettings,
  FiShoppingBag,
  FiShield,
  FiX,
} from 'react-icons/fi';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { Header } from './Header';
import { Footer } from './Footer';

const baseNavigationItems = [
  { to: '/', label: 'Главная', icon: FiHome },
  { to: '/catalog', label: 'Каталог', icon: FiGrid },
  { to: '/my-services', label: 'Мои услуги', icon: FiShoppingBag },
  { to: '/orders', label: 'Мои покупки', icon: FiShoppingBag },
  { to: '/favorites', label: 'Избранное', icon: FiHeart },
  { to: '/wallet', label: 'Кошелёк', icon: FiShoppingBag },
  { to: '/support', label: 'Поддержка', icon: FiHelpCircle },
  { to: '/settings', label: 'Настройки', icon: FiSettings },
];

export function Layout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#080304] text-white">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-[#45101a] bg-[#100305] p-4 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:static lg:translate-x-0`}
        >
          <div className="flex justify-end mb-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-[#c59ca4] hover:text-white"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="space-y-1">
            {baseNavigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)} 
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

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-[#e5092f] text-white'
                      : 'text-[#ff9aaa] hover:bg-[#26070e] hover:text-white'
                  }`
                }
              >
                <FiShield />
                <span>Админ-панель</span>
              </NavLink>
            )}
          </nav>

          <div className="mt-8 rounded-2xl border border-[#5c101e] bg-[#18050a] p-4">
            <div className="mb-2 text-sm font-bold">Тильт-платёж</div>
            <div className="text-xs text-[#9b6a73]">Быстро. Безопасно. Выгодно.</div>
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