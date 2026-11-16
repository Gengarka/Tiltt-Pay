import { useState, useEffect } from 'react';
import { FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuth();
  const location = useLocation(); 
  const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
    if (user) {
      const url = user.role === 'admin' 
        ? `${API_URL}/admin/notifications` 
        : `${API_URL}/users/${user.id}/notifications`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.unreadCount > 0) setHasUnread(true);
          else setHasUnread(false);
        })
        .catch(err => console.error(err));
    }
  }, [user, location.pathname]); 

  return (
    <header className="sticky top-0 z-40 flex min-h-16 w-full items-center border-b border-[#45101a] bg-[#100305] px-4 sm:px-6 lg:px-8">
      <div className="flex w-full items-center gap-4">
        
        <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-[#d9aeb6] hover:text-white">
          <FiMenu size={24} />
        </button>

        <Link to="/" className="shrink-0 text-lg font-extrabold tracking-tight">
          <span className="text-white">Тильт-</span>
          <span className="text-[#e5092f]">платёж</span>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2 sm:px-6">
          <div className="relative w-full max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d5b64]" />
            <input
              type="text"
              placeholder="Поиск по играм, услугам, товарам..."
              className="h-10 w-full rounded-xl border border-[#4d101b] bg-[#23070d] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#8b5d65] transition focus:border-[#e5092f]"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          
         <Link 
            to={user?.role === 'admin' ? '/admin' : '/support'} 
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-xl text-[#d9aeb6] transition hover:bg-[#26070e] hover:text-white"
            >
            <FiBell />
            {hasUnread && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e5092f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e5092f]"></span>
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#26070e]">
              {user.avatar ? (
                <img src={user.avatar} alt="Аватар" className="h-9 w-9 rounded-full border border-[#e5092f] object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5092f] bg-[#26070e] text-sm font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <span className="hidden text-sm text-white sm:inline">{user.username}</span>
            </Link>
          ) : (
            <Link to="/login" className="rounded-xl bg-[#8e0d24] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#e5092f]">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}