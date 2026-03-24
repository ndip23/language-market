import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  TrendingUp, Users, CheckCircle2,
  Clock, Zap, Globe, Calendar, Megaphone, Send, Smartphone, Search, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('teachers');
  const [data, setData] = useState({ teachers: [], students: [] });
  const [stats, setStats] = useState({ totalRevenue: 0, subscriptionRevenue: 0, commissionRevenue: 0, activeSubscriptions: 0 });
  const [loading, setLoading] = useState(true);

  // Campaign State
  const [broadcastData, setBroadcastData] = useState({ subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const fetchAdminData = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/admin/users', config),
        axios.get('/admin/stats', config)
      ]);

      setData(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Data Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const handleApprove = async (id, currentStatus) => {
    const tid = toast.loading("Updating status...");
    try {
      await axios.put(`/admin/teacher/${id}/status`, { isApproved: !currentStatus });
      toast.success("Tutor Verified & Notified", { id: tid });
      fetchAdminData();
    } catch (err) {
      toast.error("Action failed", { id: tid });
    }
  };

  // 🚨 FIXED BROADCAST LOGIC (Fixed ReferenceError)
  const handleBroadcast = async (type) => {
    if (!broadcastData.message) return toast.error("Please enter a message body");
    if (type === 'email' && !broadcastData.subject) return toast.error("Subject is required for email");

    setIsSending(true);
    const tid = toast.loading(`Dispatching ${type} broadcast...`);

    try {
      const res = await axios.post('/admin/broadcast', { ...broadcastData, type }, {
        headers: { 'x-auth-token': token }
      });

      if (type === 'whatsapp') {
        const contacts = res.data.data.map(u => `${u.name}: ${u.mobile}`).join('\n');
        const blob = new Blob([contacts], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LangConnect_WhatsApp_List.txt`;
        link.click();
        toast.success("WhatsApp list exported!", { id: tid });
      } else {
        toast.success("Email broadcast successful!", { id: tid });
      }
      setBroadcastData({ subject: '', message: '' });
    } catch (err) {
      toast.error("Campaign failed to send", { id: tid });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">

        {/* 1. HEADER & NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6">
          <div className="text-left w-full">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
              System Root.
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 italic underline decoration-emerald-500 decoration-4">
              Intelligence & Global Campaigns
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto overflow-x-auto">
            {['teachers', 'students', 'campaigns'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 md:px-10 py-3 cursor-pointer rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 2. FINANCIAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-2xl relative border-b-4 border-emerald-500">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2 italic">Gross Platform Revenue</p>
            <div className="text-4xl font-black tracking-tighter italic">${stats.totalRevenue}</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl group">
            <Zap className="text-emerald-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1 italic">Subscription Income</p>
            <div className="text-3xl font-black text-slate-900">${stats.subscriptionRevenue}</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl">
            <TrendingUp className="text-blue-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1 italic">Commission Share</p>
            <div className="text-3xl font-black text-slate-900">${stats.commissionRevenue}</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl">
            <Users className="text-purple-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1 italic">Community Size</p>
            <div className="text-3xl font-black text-slate-900">{(data.teachers?.length || 0) + (data.students?.length || 0)}</div>
          </div>
        </div>

        {/* 3. CONDITIONAL CONTENT */}
        {activeTab === 'campaigns' ? (
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3.5rem] shadow-2xl border border-white animate-in slide-in-from-bottom-6">
             <div className="flex items-center space-x-4 mb-10">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Megaphone size={28}/></div>
                <h2 className="text-3xl font-black text-slate-900 italic">Marketplace Broadcast</h2>
             </div>
             <div className="space-y-8">
                <input placeholder="Subject Line..." value={broadcastData.subject} onChange={e => setBroadcastData({...broadcastData, subject: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" />
                <textarea placeholder="Write your enticing message..." rows="8" value={broadcastData.message} onChange={e => setBroadcastData({...broadcastData, message: e.target.value})} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-medium text-slate-900 leading-relaxed outline-none focus:ring-2 ring-emerald-500/20" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => handleBroadcast('email')} disabled={isSending} className="flex items-center justify-center bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"><Send size={16} className="mr-3"/> Blast Email</button>
                    <button onClick={() => handleBroadcast('whatsapp')} disabled={isSending} className="flex items-center justify-center bg-emerald-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20"><Smartphone size={16} className="mr-3"/> Export WhatsApp</button>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[9px] tracking-widest italic">
                  <tr>
                    <th className="px-10 py-8">Identity</th>
                    <th className="px-10 py-8 text-center">Region</th>
                    <th className="px-10 py-8">Payment Logic & Timestamps</th>
                    <th className="px-10 py-8 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {(activeTab === 'teachers' ? data.teachers : data.students).map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-10 flex items-center space-x-5">
                        <img src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.name}&background=10b981&color=fff`} className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white" />
                        <div>
                          <div className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">{u.name}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</div>
                        </div>
                      </td>
                      <td className="px-10 py-10 text-center font-black text-slate-900 text-xs italic tracking-tighter">{u.countryCode}</td>
                      
                      {/* 🚨 RESPONSIVE STATUS + TIMESTAMP COLUMN */}
                      <td className="px-10 py-10">
                        {activeTab === 'teachers' ? (
                          u.subscription?.plan !== 'none' ? (
                            <div className="flex flex-col gap-2">
                              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest border border-emerald-100 italic w-fit">Paid: {u.subscription.plan}</span>
                              <div className="flex items-center text-[8px] font-black text-slate-400 uppercase mt-1 italic">
                                <Clock size={10} className="mr-1.5 text-emerald-500 opacity-60" />
                                {u.subscription?.subscribedAt ? `${new Date(u.subscription.subscribedAt).toLocaleDateString()} @ ${new Date(u.subscription.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "DATE: N/A"}
                              </div>
                            </div>
                          ) : <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest border border-amber-100 animate-pulse italic">Unpaid</span>
                        ) : (
                          <div className="flex flex-wrap gap-3 max-w-[300px]">
                            {u.bookedTutors && u.bookedTutors.length > 0 ? u.bookedTutors.map((c, i) => (
                              <div key={i} className={`flex flex-col p-3 rounded-2xl border transition-all ${c.isPaid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${c.isPaid ? 'text-slate-900' : 'text-slate-400'}`}>with {c.teacher?.name}</span>
                                {c.isPaid && <span className="text-[7px] font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center">
                                  <CheckCircle2 size={8} className="mr-1 text-emerald-500" />
                                  {c.paidAt ? new Date(c.paidAt).toLocaleDateString() : "DATE: N/A"}
                                </span>}
                              </div>
                            )) : <span className="text-slate-300 text-[10px] font-bold italic uppercase">No active connections</span>}
                          </div>
                        )}
                      </td>

                      <td className="px-10 py-10 text-right">
                        {activeTab === 'teachers' ? (
                          <button onClick={() => handleApprove(u._id, u.teacherProfile?.isApproved)} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${u.teacherProfile?.isApproved ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100' : 'bg-emerald-600 text-white hover:bg-slate-900'}`}>
                             {u.teacherProfile?.isApproved ? 'Suspend' : 'Approve & Notify'}
                          </button>
                        ) : <button className="px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50">Manage</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;