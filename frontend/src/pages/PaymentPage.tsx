import { useState } from 'react';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:3001/api';

export function PaymentPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('1000');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Убираем всё, кроме цифр
    setAmount(value);
  };

  const handleProceed = () => {
    setError('');
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount < 100 || numAmount > 69000) {
      setError('Введите сумму от 100 до 69 000 рублей');
      return;
    }

    setShowQR(true);
  };

  const handleDeposit = async () => {
    setError('');
    const numAmount = Number(amount);
    
    if (isNaN(numAmount) || numAmount < 100 || numAmount > 69000) {
      setError('Некорректная сумма');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user.id}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Бэкенд не отвечает. Возможно, маршрут /deposit не добавлен или сервер упал.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка пополнения');
      }

      login({ ...user, balance: data.newBalance });
      navigate('/profile'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-8">
      <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] hover:text-white">
        <FiArrowLeft /> Вернуться в профиль
      </Link>

      <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 sm:p-8 text-center">
        <h1 className="text-2xl font-extrabold mb-2">Пополнение кошелька</h1>
        <p className="text-sm text-[#805861] mb-8">Выберите сумму и оплатите по QR-коду</p>

        {error && (
          <div className="mb-6 rounded-xl border border-[#7d1728] bg-[#2a0710] px-4 py-3 text-sm text-[#ff9aaa] font-medium text-left">
            {error}
          </div>
        )}

        {!showQR ? (
          <>
            <div className="mb-6">
              <label className="block text-sm text-[#d9aeb6] mb-2 font-medium">Сумма (₽)</label>
              <input
                type="text" 
                inputMode="numeric" 
                value={amount}
                onChange={handleAmountChange} 
                placeholder="Введите сумму"
                className="h-14 w-full text-center text-2xl font-bold rounded-xl border border-[#45101a] bg-[#18050a] text-white outline-none focus:border-[#e5092f] transition"
              />
              <p className="text-xs text-[#805861] mt-2">Минимум 100 ₽, максимум 69 000 ₽</p>
            </div>
            <button
              onClick={handleProceed}
              className="w-full rounded-xl bg-[#8e0d24] py-4 text-white font-bold transition hover:bg-[#e5092f]"
            >
              Перейти к оплате
            </button>
          </>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Оплатите {Number(amount).toLocaleString('ru-RU')} ₽ по СБП</h2>
            
            <div className="bg-white p-4 inline-block rounded-xl mb-6">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=Спасибо%20за%20покупку!%20Но%20это%20же%20Тильт-Платеж,%20тут%20все%20бесплатно!%20С%20тебя%200%20рублей!" 
                alt="QR-код" 
                className="w-48 h-48"
              />
            </div>
            
            <p className="text-xs text-[#e5092f] mb-6">Отсканируйте код в приложении банка или наведите камеру</p>

            <button
              onClick={handleDeposit}
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-4 text-white font-bold transition hover:bg-green-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiCheckCircle /> {loading ? 'Зачисляем...' : 'Я оплатил, зачислить деньги'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}