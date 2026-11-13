import { useState, useRef } from 'react';
import { FiCheckCircle, FiSave, FiAlertCircle, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function SettingsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 2 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, newPassword, bio, avatar }),
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
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div 
            className="relative h-28 w-28 cursor-pointer group rounded-full border-2 border-[#8e0d24] overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={avatar || 'https://via.placeholder.com/150'}
              alt="Аватар"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <FiCamera className="text-white text-2xl" />
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
          />
          <p className="mt-3 text-xs text-[#805861]">Нажмите на фото, чтобы изменить</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">О себе (для профиля продавца)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Расскажите о своем опыте в играх, какие услуги предоставляете..."
              className="w-full rounded-xl border border-[#45101a] bg-[#18050a] p-4 text-white outline-none focus:border-[#e5092f] resize-none"
            />
          </div>

          <div className="my-6 h-px bg-[#45101a]" />

          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]"
              placeholder="Оставьте пустым, если не хотите менять"
            />
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
          className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#8e0d24] py-4 text-sm font-bold text-white transition hover:bg-[#e5092f] disabled:opacity-50"
        >
          <FiSave /> {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
}