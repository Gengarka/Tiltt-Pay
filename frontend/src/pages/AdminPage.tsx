import { useEffect, useState } from 'react';
import { FiTrash2, FiUsers, FiPackage, FiShield, FiEdit, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'users' | 'services'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
      return;
    }

    async function loadData() {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          fetch(`${API_URL}/admin/users`),
          fetch(`${API_URL}/admin/services`)
        ]);
        if (usersRes.ok) setUsers(await usersRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
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
      if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Ошибка удаления на сервере');
      }
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleUpdateBalance = async () => {
    if (!editingUser || !amount) return;
    const numAmount = Number(amount);
    
    try {
      const res = await fetch(`${API_URL}/admin/users/${editingUser.id}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, balance: data.newBalance } : u));
        setEditingUser(null);
        setAmount('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Ошибка изменения баланса');
    }
  };

  if (authLoading || loading) return <div className="py-20 text-center text-[#805861]">Загрузка...</div>;

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
              <button onClick={() => setEditingUser(null)} className="text-[#805861] hover:text-white"><FiX size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-[#805861]">Текущий баланс: <span className="text-white font-bold">{Number(editingUser.balance).toLocaleString('ru-RU')} ₽</span></p>
              
              <div>
                <label className="block text-sm text-[#d9aeb6] mb-2">Изменить баланс (введите число, например 500 или -200)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="+500 или -100"
                  className="w-full h-12 rounded-xl border border-[#45101a] bg-[#18050a] px-4 text-white outline-none focus:border-[#e5092f]" 
                />
              </div>

              <button 
                onClick={handleUpdateBalance}
                className="w-full mt-4 bg-[#8e0d24] hover:bg-[#e5092f] text-white font-bold py-3 rounded-xl transition"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-6 border-b border-[#45101a] pb-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-[#8e0d24] text-white' : 'text-[#b88b94] hover:bg-[#26070e]'}`}
        >
          <FiUsers /> Пользователи ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === 'services' ? 'bg-[#8e0d24] text-white' : 'text-[#b88b94] hover:bg-[#26070e]'}`}
        >
          <FiPackage /> Услуги ({services.length})
        </button>
      </div>

      <div className="rounded-3xl border border-[#45101a] bg-[#100305] p-6 overflow-hidden">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#45101a] text-[#805861] text-sm">
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">Имя</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 px-2">Роль</th>
                  <th className="pb-3 px-2">Баланс</th>
                  <th className="pb-3 px-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[#26070e] hover:bg-[#18050a]">
                    <td className="py-3 px-2 text-sm">{u.id}</td>
                    <td className="py-3 px-2 font-medium">{u.username}</td>
                    <td className="py-3 px-2 text-sm text-[#b88b94]">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs border ${u.role === 'admin' ? 'border-[#e5092f] text-[#ff8798]' : 'border-[#1d6338] text-[#70d99a]'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-bold">{Number(u.balance).toLocaleString('ru-RU')} ₽</td>
                    <td className="py-3 px-2">
                      <button 
                        onClick={() => setEditingUser(u)}
                        className="p-2 rounded-lg text-[#b88b94] hover:bg-[#26070e] hover:text-white transition"
                        title="Редактировать пользователя"
                      >
                        <FiEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            {services.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-[#45101a] bg-[#18050a]">
                <div>
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-[#805861]">Продавец: {s.sellerName} • Статус: {s.status}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#e5092f]">{Number(s.price).toLocaleString('ru-RU')} ₽</span>
                  <button 
                    onClick={() => handleDeleteService(s.id)}
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
      </div>
    </div>
  );
}