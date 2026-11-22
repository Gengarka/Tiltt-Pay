import { useState, useEffect } from 'react';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function ServiceFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const isEditing = Boolean(id);
  
  const isAdmin = user?.role === 'admin';

  const [games, setGames] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [gameName, setGameName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Обучение');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        if (!isEditing && data.length > 0) setGameName(data[0].name);
      });
  }, [user, navigate, isEditing]);

  useEffect(() => {
    if (isEditing && id) {
      fetch(`${API_URL}/services/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!isAdmin && data.sellerId !== user?.id) {
            navigate('/my-services');
            return;
          }

          setTitle(data.title);
          setGameName(data.gameName || '');
          setPrice(data.price.toString());
          setCategory(data.category);
          setDescription(data.description);
          setImage(data.image || '');
        })
        .catch(err => console.error('Ошибка загрузки:', err));
    }
  }, [isEditing, id, isAdmin, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Картинка слишком большая (макс. 2 МБ)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string); 
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !price || !description || !gameName) {
      setError('Заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      
      const url = isEditing ? `${API_URL}/services/${id}` : `${API_URL}/services`;
      const method = isEditing ? 'PUT' : 'POST';

      const bodyData: any = {
        title,
        description,
        price: Number(price),
        category,
        gameName,
        image 
      };

      if (!isEditing) bodyData.sellerId = user?.id;

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Ошибка при сохранении');

      navigate(isAdmin ? '/admin' : '/my-services'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <Link 
        to={isAdmin ? '/admin' : '/my-services'} 
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white"
      >
        <FiArrowLeft /> {isAdmin ? 'Назад в админ-панель' : 'Назад к услугам'}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isEditing ? 'Редактирование услуги' : 'Новая услуга'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8 space-y-5">
        
        <div className="flex items-center gap-6 mb-4">
          <div className="w-32 h-32 rounded-xl border border-dashed border-[#45101a] bg-[#18050a] flex items-center justify-center overflow-hidden relative group">
            {image ? (
              <img src={image} alt="Превью" className="w-full h-full object-cover" />
            ) : (
              <FiImage className="text-4xl text-[#45101a]" />
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Загрузить фото"
            />
          </div>
          <div>
            <h3 className="font-medium text-[#d9aeb6]">Обложка услуги</h3>
            <p className="text-xs text-[#b88b94] mt-1">Нажмите на квадрат, чтобы выбрать картинку (до 2 МБ)</p>
          </div>
        </div>

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
              <option value="" disabled>Выберите игру</option>
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
          <FiSave /> {loading ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Опубликовать услугу')}
        </button>
      </form>
    </div>
  );
}