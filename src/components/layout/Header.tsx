import { FiBell, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex min-h-16 w-full items-center border-b border-[#45101a] bg-[#100305] px-4 sm:px-6 lg:px-8">
      <div className="flex w-full items-center gap-4">
        <Link
          to="/"
          className="shrink-0 text-lg font-extrabold tracking-tight"
        >
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
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-[#d9aeb6] transition hover:bg-[#26070e] hover:text-white"
            aria-label="Уведомления"
          >
            <FiBell />
          </button>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[#26070e]"
          >
            <img
              src="https://i.pravatar.cc/80?img=47"
              alt=""
              className="h-9 w-9 rounded-full border border-[#e5092f]"
            />

            <span className="hidden text-sm text-white sm:inline">
              Nika
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}