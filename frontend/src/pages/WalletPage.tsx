import { useEffect, useState } from 'react';
import { FiCreditCard, FiPlusCircle, FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi'; // <-- Убрали FiPackage
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Payment {
  id: number;
  amount: number;
  date: string;
  status: string;
  payment_method: string;
  service_title: string;
}

export function WalletPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchPayments() {
      if (!user) return; 

      try {
        const res = await fetch(`${API_URL}/users/${user.id}/payments`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">Личный кабинет</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Мой кошелёк</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl border border-[#5c101e] bg-gradient-to-br from-[#3a0812] to-[#130407] p-8 h-fit">
          <p className="text-sm text-[#b88b94] mb-2 flex items-center gap-2">
            <FiCreditCard /> Текущий баланс
          </p>
          <div className="text-4xl font-extrabold mb-6">
            {Number(user.balance).toLocaleString('ru-RU')} ₽
          </div>
          <Link
            to="/payment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8e0d24] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]"
          >
            <FiPlusCircle /> Пополнить
          </Link>
        </div>

        <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6">
          <h2 className="font-bold text-lg mb-6">История операций</h2>
          
          {loading ? (
            <div className="text-center py-8 text-[#805861]">Загрузка...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-[#805861] border border-dashed border-[#45101a] rounded-xl">
              У вас пока нет операций
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-[#45101a] bg-[#18050a]">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${payment.service_title ? 'bg-[#2a0710] text-[#ff8798]' : 'bg-[#0b2818] text-[#70d99a]'}`}>
                      {payment.service_title ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {payment.service_title ? `Покупка: ${payment.service_title}` : 'Пополнение баланса'}
                      </p>
                      <p className="text-xs text-[#805861]">
                        {new Date(payment.date).toLocaleString('ru-RU')} • {payment.payment_method || 'СБП'}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${payment.service_title ? 'text-[#ff8798]' : 'text-[#70d99a]'}`}>
                    {payment.service_title ? '-' : '+'}{Number(payment.amount).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}