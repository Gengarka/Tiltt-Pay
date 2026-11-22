import { useEffect, useState } from 'react';
import { FiTrash2, FiUsers, FiPackage, FiShield, FiEdit, FiX, FiMail, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'users' | 'services' | 'support'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [amount, setAmount] = useState('');
  
  const [replyTicket, setReplyTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
      return;
    }

    async function loadData() {
      try {
        const [usersRes, servicesRes, ticketsRes] = await Promise.all([
          fetch(`${API_URL}/admin/users`),
          fetch(`${API_URL}/admin/services`),
          fetch(`${API_URL}/admin/support`)
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (ticketsRes.ok) setTickets(await ticketsRes.json());
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadData();
  }, [user, authLoading, navigate]);

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Удалить услугу?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) setServices(prev => prev.filter(s => s.id !== id));
      else alert('Ошибка удаления');
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleUpdateBalance = async () => {
    if (!editingUser || !amount) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${editingUser.id}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, balance: data.newBalance } : u));
        setEditingUser(null);
        setAmount('');
      } else alert(data.error);
    } catch (error) {
      alert('Ошибка изменения баланса');
    }
  };

  const handleReplyTicket = async () => {
    if (!replyTicket || !replyText) return;
    try {
      const res = await fetch(`${API_URL}/admin/support/${replyTicket.id_ticket}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id_ticket === replyTicket.id_ticket ? { ...t, admin_reply: replyText, status: 'closed' } : t));
        setReplyTicket(null);
        setReplyText('');
      }
    } catch (error) {
      alert('Ошибка ответа');
    }
  };

  if (authLoading || loading) return <div className="py-20 text-center text-[#b88b94]">Загрузка...</div>;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      <div className="mb-8 flex items-center gap-3">
        <FiShield className="text-4xl text-[#e5092f]" />
        <div>
          <p className="mb-1 text-sm font-medium text-[#e5092f]">Панель управления</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Админ-панель</h1>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#100305] border border-[#45101a] rounded-3xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Пользователь: {editingUser.username}</h2>
              <button onClick={() => setEditingUser(null)} className="text-[#b88b94] hover:text-white"><FiX size={24} /></button>
            </div>
            <p className="text-sm text-[#b88b94] mb-4">Текущий баланс: <span className="text-white font-bold">{Number(editingUser.balance).toLocaleString('ru-RU')} ₽</span></p>
            <label className="block text-sm text-[#d9aeb6] mb-2">Изменить баланс (например +500 или -100)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full h-12 rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]" />
            <button onClick={handleUpdateBalance} className="w-full mt-4 bg-[#8e0d24] hover:bg-[#e5092f] text-white font-bold py-3 rounded-xl">Применить</button>
          </div>
        </div>
      )}

      {replyTicket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#100305] border border-[#45101a] rounded-3xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ответ пользователю {replyTicket.username}</h2>
              <button onClick={() => setReplyTicket(null)} className="text-[#b88b94] hover:text-white"><FiX size={24} /></button>
            </div>
            <div className="p-3 bg-[#18050a] rounded-xl mb-4 border border-[#45101a]">
              <p className="text-xs text-[#b88b94] mb-1">Сообщение:</p>
              <p className="text-sm text-white">{replyTicket.message}</p>
            </div>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} placeholder="Напишите ответ..." className="w-full rounded-xl border border-[#45101a] bg-[#18050a] p-4 text-white outline-none focus:border-[#e5092f] resize-none" />
            <button onClick={handleReplyTicket} className="w-full mt-4 flex items-center justify-center gap-2 bg-[#8e0d24] hover:bg-[#e5092f] text-white font-bold py-3 rounded-xl"><FiSend /> Отправить ответ</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 border-b border-[#45101a] pb-4">
        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-[#8e0d24] text-white' : 'text-[#b88b94] hover:bg-[#26070e]'}`}><FiUsers /> Пользователи</button>
        <button onClick={() => setActiveTab('services')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === 'services' ? 'bg-[#8e0d24] text-white' : 'text-[#b88b94] hover:bg-[#26070e]'}`}><FiPackage /> Услуги</button>
        <button onClick={() => setActiveTab('support')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === 'support' ? 'bg-[#8e0d24] text-white' : 'text-[#b88b94] hover:bg-[#26070e]'}`}><FiMail /> Обращения</button>
      </div>

      <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 overflow-hidden">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-[#45101a] text-[#b88b94] text-sm">
                <th className="pb-3 px-2">ID</th><th className="pb-3 px-2">Имя</th><th className="pb-3 px-2">Email</th><th className="pb-3 px-2">Роль</th><th className="pb-3 px-2">Баланс</th><th className="pb-3 px-2">Действия</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[#26070e] hover:bg-[#18050a]">
                    <td className="py-3 px-2 text-sm">{u.id}</td>
                    <td className="py-3 px-2 font-medium">{u.username}</td>
                    <td className="py-3 px-2 text-sm text-[#b88b94]">{u.email}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded text-xs border ${u.role === 'admin' ? 'border-[#e5092f] text-[#ff8798]' : 'border-[#1d6338] text-[#70d99a]'}`}>{u.role}</span></td>
                    <td className="py-3 px-2 font-bold">{Number(u.balance).toLocaleString('ru-RU')} ₽</td>
                    <td className="py-3 px-2"><button onClick={() => setEditingUser(u)} className="p-2 rounded-lg text-[#b88b94] hover:bg-[#26070e] hover:text-white"><FiEdit size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
  <div className="space-y-4">
    {services.map(s => (
      <div 
        key={s.id} 
        onClick={() => navigate(`/service/${s.id}`, { state: { fromAdmin: true } })}
        className="flex items-center justify-between p-4 rounded-xl border border-[#45101a] bg-[#18050a] cursor-pointer hover:bg-[#23070d] transition"
      >
        <div>
          <h3 className="font-bold">{s.title}</h3>
          <p className="text-sm text-[#b88b94]">Продавец: {s.sellerName}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#e5092f]">{Number(s.price).toLocaleString('ru-RU')} ₽</span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              navigate(`/admin/services/edit/${s.id}`);
            }} 
            className="p-2 rounded-lg text-[#b88b94] hover:bg-[#26070e] hover:text-white transition"
            title="Редактировать услугу"
          >
            <FiEdit size={20} />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeleteService(s.id);
            }} 
            className="p-2 rounded-lg text-[#ff7186] hover:bg-[#2a0710] transition"
            title="Удалить услугу"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
    ))}
  </div>
)}

        {activeTab === 'support' && (
          <div className="space-y-4">
            {tickets.map(t => (
              <div key={t.id_ticket} className="p-4 rounded-xl border border-[#45101a] bg-[#18050a]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-white">{t.username}</span>
                    <span className="text-sm text-[#b88b94] ml-2">({t.email})</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${t.status === 'closed' ? 'bg-[#0b2818] text-[#70d99a]' : 'bg-[#2a0710] text-[#ff8798]'}`}>
                    {t.status === 'closed' ? 'Закрыт' : 'Открыт'}
                  </span>
                </div>
                <p className="text-sm text-[#d9aeb6] mb-3">{t.message}</p>
                
                {t.admin_reply ? (
                  <div className="p-3 rounded-lg bg-[#26070e] border border-[#741324]">
                    <p className="text-xs font-bold text-[#e5092f] mb-1">Ваш ответ:</p>
                    <p className="text-sm text-white">{t.admin_reply}</p>
                  </div>
                ) : (
                  <button onClick={() => { setReplyTicket(t); setReplyText(''); }} className="text-sm font-medium text-[#ff7186] hover:text-white flex items-center gap-1">
                    <FiSend /> Ответить
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}