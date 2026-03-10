import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, Users, CheckCircle2, 
  Clock, Zap, Globe, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('teachers');
  const [data, setData] = useState({ teachers: [], students: [] });
  const [stats, setStats] = useState({ totalRevenue: 0, subscriptionRevenue: 0, commissionRevenue: 0, activeSubscriptions: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const usersRes = await axios.get('/admin/users', config);
      const statsRes = await axios.get('/admin/stats', config);

      setData(usersRes.data);
      setStats(statsRes.data);

    } catch (err) {
      toast.error("Handshake Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const handleApprove = async (id, currentStatus) => {
    const tid = toast.loading("Processing...");

    try {
      await axios.put(`/admin/teacher/${id}/status`, { isApproved: !currentStatus });

      toast.success("Tutor Status Updated", { id: tid });
      fetchAdminData();

    } catch (err) {
      toast.error("Failed", { id: tid });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
              System Root.
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 italic underline decoration-emerald-500 decoration-4">
              Financials & User Oversight
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 md:px-8 py-3 cursor-pointer rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === 'teachers'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400'
              }`}
            >
              Tutors
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 md:px-8 py-3 cursor-pointer rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === 'students'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400'
              }`}
            >
              Learners
            </button>
          </div>
        </div>

        {/* FINANCIAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative border-b-4 border-emerald-500">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2">Total Platform Revenue</p>
            <div className="text-4xl font-black tracking-tighter italic">${stats.totalRevenue}</div>
            <p className="text-[8px] text-slate-500 font-bold mt-2 uppercase">Gross (Comms + Subs)</p>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-all">
            <Zap className="text-emerald-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Subscription Revenue</p>
            <div className="text-3xl font-black text-slate-900">${stats.subscriptionRevenue}</div>
            <p className="text-[8px] text-slate-400 font-bold mt-2 uppercase">{stats.activeSubscriptions} Paid Tutors</p>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-all">
            <TrendingUp className="text-blue-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Lesson Commissions</p>
            <div className="text-3xl font-black text-slate-900">${stats.commissionRevenue}</div>
            <p className="text-[8px] text-slate-400 font-bold mt-2 uppercase">15% Net Cuts</p>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-emerald-500 transition-all">
            <Users className="text-purple-500 mb-4" size={24} />
            <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Marketplace Size</p>
            <div className="text-3xl font-black text-slate-900">{(data.teachers?.length || 0) + (data.students?.length || 0)}</div>
            <p className="text-[8px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Global Users</p>
          </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="w-full overflow-x-auto">
            {/* Setting a min-width ensures the table doesn't collapse on mobile and remains scrollable */}
            <table className="w-full text-left min-w-[950px]">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                <tr>
                  <th className="px-6 md:px-10 py-8">User Profile</th>
                  <th className="px-6 py-8 text-center">Region</th>
                  <th className="px-6 py-8">
                    {activeTab === 'teachers' ? 'Plan & Payment Date' : 'Lesson Connections'}
                  </th>
                  <th className="px-6 md:px-10 py-8 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {(activeTab === 'teachers' ? data.teachers : data.students).map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* PROFILE */}
                    <td className="px-6 md:px-10 py-8 flex items-center space-x-4 min-w-[280px]">
                      <img
                        src={u.profilePicture || `https://ui-avatars.com/api/?name=${u.name}&background=10b981&color=fff`}
                        className="w-12 h-12 rounded-2xl object-cover shadow-sm shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-black text-slate-900 text-base md:text-lg tracking-tight truncate">{u.name}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{u.email}</div>
                      </div>
                    </td>

                    {/* REGION */}
                    <td className="px-6 py-8 text-center font-black text-slate-900 text-xs italic">
                      <Globe size={12} className="inline mr-1 text-emerald-500" />
                      {u.countryCode}
                    </td>

                    {/* STATUS + TIMESTAMP */}
                    <td className="px-6 py-8">
                      {activeTab === 'teachers' ? (
                        u.subscription?.plan !== 'none' ? (
                          <div className="flex flex-col gap-1.5">
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest border border-emerald-100 italic w-fit">
                              Paid: {u.subscription.plan}
                            </span>
                            
                            {/* NEW TIMESTAMP FOR TUTOR */}
                            <div className="flex items-center text-[7.5px] font-black text-slate-400 uppercase tracking-tighter">
                                <Clock size={10} className="mr-1 text-emerald-500 opacity-60" />
                                {u.subscription?.subscribedAt 
                                  ? `${new Date(u.subscription.subscribedAt).toLocaleDateString()} @ ${new Date(u.subscription.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                                  : "DATE: N/A"}
                            </div>
                          </div>
                        ) : (
                          <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest border border-amber-100 animate-pulse">
                            Unpaid
                          </span>
                        )
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {u.bookedTutors && u.bookedTutors.length > 0 ? (
                            u.bookedTutors.map((c, i) => (
                              <div key={i} className={`flex flex-col px-3 py-2 rounded-xl border ${c.isPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                                <span className={`text-[8px] font-black uppercase tracking-tighter ${c.isPaid ? 'text-emerald-600' : 'text-slate-400'}`}>
                                  {c.teacher?.name}
                                </span>
                                {/* NEW TIMESTAMP FOR LESSON */}
                                {c.isPaid && (
                                  <span className="text-[7px] font-black text-slate-400 mt-1 uppercase">
                                    {c.paidAt ? `Paid: ${new Date(c.paidAt).toLocaleDateString()}` : "Paid: N/A"}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-300 text-[9px] font-bold italic">No active sessions</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 md:px-10 py-8 text-right min-w-[150px]">
                      {activeTab === 'teachers' ? (
                        <button
                          onClick={() => handleApprove(u._id, u.teacherProfile?.isApproved)}
                          className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${
                            u.teacherProfile?.isApproved
                              ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100'
                              : 'bg-emerald-600 text-white hover:bg-slate-900 shadow-emerald-500/20'
                          }`}
                        >
                          {u.teacherProfile?.isApproved ? 'Suspend' : 'Approve'}
                        </button>
                      ) : (
                        <button className="px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-100 hover:bg-slate-50">
                          Details
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;