import { useState } from 'react';
import {
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      setError('Заполни все поля');
      return;
    }

    if (username.trim().length < 3) {
      setError('Имя пользователя должно содержать минимум 3 символа');
      return;
    }

    if (!email.includes('@')) {
      setError('Введи корректный email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== repeatPassword) {
      setError('Пароли не совпадают');
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
            Создать аккаунт
          </h1>

          <p className="mt-2 text-sm text-[#805861]">
            Зарегистрируйся и начинай пользоваться Тильт-платёж
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          <div className="space-y-5">
            {/* Имя */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[#d9aeb6]"
              >
                Имя пользователя
              </label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Например, PlayerOne"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-[#d9aeb6]"
              >
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="example@mail.ru"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-[#d9aeb6]"
              >
                Пароль
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Минимум 6 символов"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-12 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
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

            <div>
              <label
                htmlFor="repeat-password"
                className="mb-2 block text-sm font-medium text-[#d9aeb6]"
              >
                Повтори пароль
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#805861]" />

                <input
                  id="repeat-password"
                  type={
                    showRepeatPassword ? 'text' : 'password'
                  }
                  value={repeatPassword}
                  onChange={(event) =>
                    setRepeatPassword(event.target.value)
                  }
                  placeholder="Повтори пароль"
                  className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] pl-11 pr-12 text-sm text-white outline-none placeholder:text-[#69434b] transition focus:border-[#e5092f]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowRepeatPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#805861] transition hover:bg-[#26070e] hover:text-white"
                  aria-label={
                    showRepeatPassword
                      ? 'Скрыть пароль'
                      : 'Показать пароль'
                  }
                >
                  {showRepeatPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-[#7d1728] bg-[#2a0710] px-4 py-3 text-sm text-[#ff9aaa]">
              {error}
            </div>
          )}

          <div className="mt-5 flex items-start gap-3 text-xs leading-5 text-[#805861]">
            <FiCheck className="mt-0.5 shrink-0 text-[#e5092f]" />

            <span>
              Создавая аккаунт, ты соглашаешься с правилами использования сервиса.
            </span>
          </div>

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-xl bg-[#8e0d24] text-sm font-bold text-white transition hover:bg-[#e5092f]"
          >
            Создать аккаунт
          </button>

          <p className="mt-6 text-center text-sm text-[#805861]">
            Уже есть аккаунт?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#ff7186] transition hover:text-white"
            >
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}