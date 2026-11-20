import { useEffect, useState } from 'react';
import { FiArrowLeft, FiEdit, FiPlusCircle, FiTrash2, FiPackage } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function MyServicesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    async function fetchMyServices() {
      if (!user) return;
      try {
        const res = await fetch(`${API_URL}/services/my/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyServices();
  }, [user, authLoading, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту услугу?')) return;

    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setServices((prev) => prev.filter((service) => service.id !== id));
      } else {
        alert('Не удалось удалить услугу');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка сервера при удалении');
    }
  };

  if (authLoading || loading) return <div className="py-20 text-center text-[#b88b94]">Загрузка...</div>;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white">
        <FiArrowLeft /> Вернуться в профиль
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-[#e5092f]">Кабинет продавца</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Мои услуги</h1>
        </div>
        <Link 
          to="/my-services/new" 
          className="flex items-center gap-2 rounded-xl bg-[#8e0d24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]"
        >
          <FiPlusCircle /> Добавить услугу
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-3xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <FiPackage className="mx-auto text-4xl text-[#8e0d24] mb-4" />
          <h2 className="text-lg font-bold">У вас пока нет услуг</h2>
          <p className="mt-2 text-sm text-[#b88b94]">Создайте свою первую услугу и начните зарабатывать!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-[#45101a] bg-[#100305] gap-4">
              <div>
                <h2 className="font-bold text-lg">{service.title}</h2>
                <p className="text-sm text-[#b88b94]">Игра: {service.gameName} • Категория: {service.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-lg font-bold text-[#e5092f]">{Number(service.price).toLocaleString('ru-RU')} ₽</span>
                  <span className={`px-2 py-1 rounded text-xs border ${service.status === 'active' ? 'border-[#1d6338] text-[#70d99a]' : 'border-[#72591c] text-[#e8c96b]'}`}>
                    {service.status === 'active' ? 'Активна' : 'На модерации'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  to={`/my-services/edit/${service.id}`} 
                  className="p-3 rounded-xl border border-[#45101a] text-[#b88b94] hover:bg-[#26070e] transition"
                  title="Редактировать"
                >
                  <FiEdit />
                </Link>
                
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-3 rounded-xl border border-[#45101a] text-[#ff7186] hover:bg-[#2a0710] transition"
                  title="Удалить"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}