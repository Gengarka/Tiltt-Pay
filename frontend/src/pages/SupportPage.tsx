import { useEffect, useState } from 'react';
import { FiCheckCircle, FiSend, FiMessageCircle, FiMail, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function SupportPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) navigate('/login');
  }, [user, isLoading, navigate]);

    const loadTickets = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/support/my/${user.id}`);
      if (res.ok) {
        setTickets(await res.json());
        await fetch(`${API_URL}/users/${user.id}/notifications/read`, { method: 'PUT' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (user) loadTickets();
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    try {
      const res = await fetch(`${API_URL}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message })
      });
      if (res.ok) {
        setSent(true);
        setMessage('');
        loadTickets(); 
        setTimeout(() => setSent(false), 5000);
      }
    } catch (e) {
      alert('Ошибка отправки');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Служба поддержки</h1>
        <p className="mt-2 text-sm text-[#b88b94]">Задайте вопрос, и мы ответим вам в ближайшее время.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FiMessageCircle className="text-[#e5092f]" /> Новое обращение
            </h2>
            <form onSubmit={handleSend}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите вашу проблему..."
                rows={4}
                className="w-full rounded-xl border border-[#45101a] bg-[#18050a] p-4 text-sm text-white outline-none focus:border-[#e5092f] resize-none"
              />
              {sent && (
                <div className="mt-3 text-sm text-[#70d99a] bg-[#0b2818] p-2 rounded-lg flex items-center gap-2">
                  <FiCheckCircle /> Отправлено!
                </div>
              )}
              <button type="submit" className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#8e0d24] py-3 text-sm font-bold text-white hover:bg-[#e5092f]">
                <FiSend /> Отправить
              </button>
            </form>
          </div>

          <div className="space-y-3 text-sm text-[#b88b94]">
            <div className="flex items-center gap-3"><FiMail className="text-[#e5092f]" /> support@tilt-pay.localhost</div>
            <div className="flex items-center gap-3"><FiClock className="text-[#e5092f]" /> Отвечаем в течение 24 часов</div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6">
          <h2 className="font-bold text-lg mb-4">Мои обращения</h2>
          {loadingTickets ? (
            <p className="text-sm text-[#b88b94]">Загрузка...</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-[#b88b94]">У вас пока нет обращений.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id_ticket} className="p-4 rounded-xl border border-[#45101a] bg-[#18050a]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-[#b88b94]">{new Date(ticket.created_at).toLocaleString('ru-RU')}</span>
                    <span className={`text-xs px-2 py-1 rounded ${ticket.status === 'closed' ? 'bg-[#0b2818] text-[#70d99a]' : 'bg-[#2a0710] text-[#ff8798]'}`}>
                      {ticket.status === 'closed' ? 'Есть ответ' : 'В обработке'}
                    </span>
                  </div>
                  <p className="text-sm text-white mb-3">Вы: {ticket.message}</p>
                  
                  {ticket.admin_reply && (
                    <div className="p-3 rounded-lg bg-[#26070e] border border-[#741324]">
                      <p className="text-xs font-bold text-[#e5092f] mb-1">Ответ поддержки:</p>
                      <p className="text-sm text-[#d9aeb6]">{ticket.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}