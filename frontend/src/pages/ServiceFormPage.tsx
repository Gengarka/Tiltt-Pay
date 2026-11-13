import { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function ServiceFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [gameName, setGameName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Обучение');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        if (data.length > 0) setGameName(data[0].name);
      });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !price || !description) {
      setError('Заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: user?.id,
          title,
          description,
          price: Number(price),
          category,
          gameName
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Ошибка при создании');

      navigate('/my-services'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <Link to="/my-services" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white">
        <FiArrowLeft /> Назад к услугам
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Новая услуга</h1>
        <p className="mt-2 text-sm text-[#805861]">Заполните информацию о товаре, который вы хотите продать.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Название услуги *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
            className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]" placeholder="Например: Буст рейтинга в Dota 2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Игра *</label>
            <select value={gameName} onChange={e => setGameName(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]">
              {games.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Цена (₽) *</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} 
              className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]" placeholder="1000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Категория</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]">
            <option value="Обучение">Обучение</option>
            <option value="Буст">Буст</option>
            <option value="Скины">Скины</option>
            <option value="Донат">Донат</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#d9aeb6] mb-2">Описание *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
            className="w-full rounded-xl border border-[#45101a] bg-[#18050a] p-4 text-white outline-none focus:border-[#e5092f] resize-none" placeholder="Расскажите, что входит в услугу..." />
        </div>

        {error && <div className="text-sm text-[#ff8798] bg-[#2a0710] p-3 rounded-lg border border-[#7d1728]">{error}</div>}

        <button type="submit" disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#8e0d24] py-4 text-sm font-bold text-white transition hover:bg-[#e5092f] disabled:opacity-50">
          <FiSave /> {loading ? 'Публикация...' : 'Опубликовать услугу'}
        </button>
      </form>
    </div>
  );
}