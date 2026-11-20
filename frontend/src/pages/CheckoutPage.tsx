import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Service } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function CheckoutPage() {
  const { id } = useParams();
  const { user, login } = useAuth(); // login нужен, чтобы обновить баланс в шапке
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isPaying, setIsPaying] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadService() {
      try {
        const res = await fetch(`${API_URL}/services/${id}`);
        if (res.ok) {
          const data = await res.json();
          setService({ ...data, price: Number(data.price) });
        }
      } catch (err) {
        setError('Ошибка загрузки услуги');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id, user, navigate]);

  const handlePay = async () => {
    if (!user || !service) return;

    if (user.balance < service.price) {
      setError('Недостаточно средств. Пополните баланс в профиле!');
      return;
    }

    try {
      setIsPaying(true);
      
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          serviceId: service.id,
          price: service.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка оплаты');
      }

      login({ ...user, balance: user.balance - service.price });

      setShowQR(true);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-[#b88b94]">Загрузка...</div>;
  if (!service) return <div className="py-20 text-center text-[#ff8798]">Услуга не найдена</div>;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      <Link to={`/service/${service.id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white">
        <FiArrowLeft /> Вернуться к услуге
      </Link>

      <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold mb-8">Оформление заказа</h1>

        <div className="flex justify-between items-center border-b border-[#45101a] pb-4 mb-4">
          <div>
            <p className="font-bold text-lg">{service.title}</p>
            <p className="text-sm text-[#b88b94]">Продавец: {service.sellerName}</p>
          </div>
          <div className="text-2xl font-bold text-[#e5092f]">{service.price} ₽</div>
        </div>

        <div className="flex justify-between items-center text-sm mb-8">
          <span className="text-[#b88b94]">Ваш текущий баланс:</span>
          <span className={user!.balance < service.price ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
            {user!.balance} ₽
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#7d1728] bg-[#2a0710] px-4 py-3 text-sm text-[#ff9aaa]">
            {error}
          </div>
        )}

            {!showQR ? (
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full rounded-xl bg-[#8e0d24] py-4 text-lg font-bold text-white transition hover:bg-[#e5092f] disabled:opacity-50"
          >
            {isPaying ? 'Обработка...' : 'Оплатить с баланса'}
          </button>
        ) : (
          <div className="text-center bg-[#18050a] border border-[#5c101e] rounded-2xl p-6">
            <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Заказ успешно оплачен!</h2>
            <p className="text-sm text-[#b88b94] mb-6">Средства списаны с баланса. Продавец свяжется с вами.</p>
            
            <Link to="/orders" className="block w-full rounded-xl bg-[#8e0d24] py-3 text-white font-bold hover:bg-[#e5092f]">
              Перейти в историю заказов
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}