import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3001/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Заполни все поля');
      return;
    }

    if (!email.includes('@')) {
      setError('Введи корректный email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      login(data); 
      navigate('/profile'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Что-то пошло не так');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8e0d24] text-xl font-extrabold text-white shadow-lg shadow-[#8e0d24]/20">
            Т
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Создание аккаунта</h1>
          <p className="mt-2 text-sm text-[#805861]">Присоединяйся к Тильт-платеж</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-[#d9aeb6]">
                Имя пользователя
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Твой никнейм"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#d9aeb6]">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#d9aeb6]">
                Пароль
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-12 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#805861] transition hover:bg-[#26070e] hover:text-white"
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
            disabled={loading}
            className="mt-6 h-12 w-full rounded-xl bg-[#8e0d24] text-sm font-bold text-white transition hover:bg-[#e5092f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#45101a]" />
            <span className="text-xs text-[#69434b]">или</span>
            <div className="h-px flex-1 bg-[#45101a]" />
          </div>

          <p className="text-center text-sm text-[#805861]">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="font-semibold text-[#ff7186] transition hover:text-white">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}