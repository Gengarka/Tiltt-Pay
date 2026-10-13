import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Заполни все поля');
      return;
    }

    if (!email.includes('@')) {
      setError('Введи корректный email');
      return;
    }

    navigate('/profile');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8e0d24] text-xl font-extrabold text-white shadow-lg shadow-[#8e0d24]/20">
            Т
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            С возвращением
          </h1>

          <p className="mt-2 text-sm text-[#805861]">
            Войди в аккаунт, чтобы продолжить
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#d9aeb6]"
              >
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@mail.ru"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#d9aeb6]"
                >
                  Пароль
                </label>

                <button
                  type="button"
                  className="text-xs text-[#ff7186] transition hover:text-white"
                >
                  Забыли пароль?
                </button>
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Введите пароль"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-12 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#805861] transition hover:bg-[#26070e] hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Скрыть пароль'
                      : 'Показать пароль'
                  }
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-[#7d1728] bg-[#2a0710] px-4 py-3 text-sm text-[#ff9aaa]">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-xl bg-[#8e0d24] text-sm font-bold text-white transition hover:bg-[#e5092f]"
          >
            Войти
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#45101a]" />
            <span className="text-xs text-[#69434b]">
              или
            </span>
            <div className="h-px flex-1 bg-[#45101a]" />
          </div>

          <p className="text-center text-sm text-[#805861]">
            Нет аккаунта?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#ff7186] transition hover:text-white"
            >
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}