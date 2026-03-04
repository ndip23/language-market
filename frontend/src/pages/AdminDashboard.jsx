import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, Users, ShieldCheck, CheckCircle2, 
  XCircle, Star, Mail, Search, LayoutGrid, User, ArrowUpRight, ArrowRight, Clock, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('teachers');
  const [data, setData] = useState({ teachers: [], students: [] });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const usersRes = await axios.get('/admin/users', config);
      const statsRes = await axios.get('/admin/stats', config);
      setData(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Access Denied or Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, [token]);

  const handleApprove = async (id, currentStatus) => {
    const tid = toast.loading("Processing approval...");
    try {
      await axios.put(`/admin/teacher/${id}/status`, { isApproved: !currentStatus });
      toast.success("Status Updated & Email Dispatched", { id: tid });
      fetchAdminData();
    } catch (err) { toast.error("Action failed", { id: tid }); }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6">
            <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">System Root.</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic underline decoration-emerald-500 decoration-4">Platform Intelligence & Control</p>
            </div>
            
            {/* TABS */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                <button onClick={() => setActiveTab('teachers')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'teachers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'}`}>Teachers</button>
                <button onClick={() => setActiveTab('students')} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'}`}>Learners</button>
            </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:border-emerald-500 transition-colors">
            <TrendingUp className="text-emerald-500 mb-6" size={32} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Net Platform Revenue (15%)</p>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">${stats.totalRevenue}</div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-colors">
            <CheckCircle2 className="text-blue-500 mb-6" size={32} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Active Subscriptions</p>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{stats.activeSubscriptions}</div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-colors">
            <Users className="text-purple-500 mb-6" size={32} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Marketplace Users</p>
            <div className="text-5xl font-black text-slate-900 tracking-tighter">{stats.totalTeachers + stats.totalStudents}</div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-700">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-6 italic">Identity</th>
                <th className="px-8 py-6 text-center italic">Region</th>
                <th className="px-8 py-6 italic">{activeTab === 'teachers' ? 'Payment Status' : 'Account Type'}</th>
                <th className="px-8 py-6 text-right italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(activeTab === 'teachers' ? data.teachers : data.students).map(u => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-8 flex items-center space-x-5">
                    <img src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.name}&background=10b981&color=fff`} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" alt=""/>
                    <div>
                        <div className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">{u.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center font-black text-slate-900 text-xs">{u.countryCode}</td>
                  <td className="px-8 py-8">
                    {activeTab === 'teachers' ? (
                        /* 🚨 PAYMENT STATUS BADGES */
                        u.subscription.plan !== 'none' ? (
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border border-emerald-100 italic flex items-center w-fit">
                                <CheckCircle2 size={12} className="mr-1.5"/> Paid: {u.subscription.plan}
                            </span>
                        ) : (
                            <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border border-amber-100 italic flex items-center w-fit animate-pulse">
                                <Clock size={12} className="mr-1.5"/> Payment Pending
                            </span>
                        )
                    ) : (
                        <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest italic">Standard Learner</span>
                    )}
                  </td>
                  <td className="px-8 py-8 text-right">
                    {activeTab === 'teachers' ? (
                        <button 
                            onClick={() => handleApprove(u._id, u.teacherProfile.isApproved)}
                            className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${u.teacherProfile.isApproved ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100' : 'bg-emerald-600 text-white hover:bg-slate-900'}`}
                        >
                            {u.teacherProfile.isApproved ? 'Suspend' : 'Approve & Notify'}
                        </button>
                    ) : (
                        <button className="px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50">Manage</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;