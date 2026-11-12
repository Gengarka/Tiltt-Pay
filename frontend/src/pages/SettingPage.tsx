import { useState } from 'react';
import { FiCheckCircle, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3001/api';

export function SettingsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');

      login(data); 
      setNewPassword(''); 
      setSuccess('Настройки успешно сохранены!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">Личный кабинет</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Настройки профиля</h1>
        <p className="mt-2 text-sm text-[#805861]">Управляйте своими личными данными и безопасностью.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8">
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Имя пользователя (Никнейм)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f] transition"
              placeholder="Ваш никнейм"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Email (Почта)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f] transition"
              placeholder="example@mail.ru"
            />
          </div>

          <div className="my-6 h-px bg-[#45101a]" />

          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f] transition"
              placeholder="Оставьте пустым, если не хотите менять"
            />
            <p className="mt-2 text-xs text-[#805861]">Минимум 6 символов. Если не хотите менять пароль, оставьте поле пустым.</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-sm text-[#ff8798] bg-[#2a0710] p-3 rounded-lg border border-[#7d1728] flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="mt-6 text-sm text-[#70d99a] bg-[#0b2818] p-3 rounded-lg border border-[#1d6338] flex items-center gap-2">
            <FiCheckCircle /> {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#8e0d24] py-4 text-sm font-bold text-white transition hover:bg-[#e5092f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave /> {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
}