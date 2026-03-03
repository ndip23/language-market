import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ stats: {}, teachers: [] });

  const fetch = async () => {
    const config = { headers: { 'x-auth-token': token } };
    const stats = await axios.get('/admin/stats', config);
    const teachers = await axios.get('/admin/teachers', config);
    setData({ stats: stats.data, teachers: teachers.data });
  };

  useEffect(() => { fetch(); }, [token]);

  const toggleApprove = async (id, current) => {
    await axios.put(`/admin/teacher/${id}/status`, { isApproved: !current }, { headers: { 'x-auth-token': token } });
    fetch();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 mb-16 italic tracking-tighter">System Root</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <TrendingUp size={32} className="text-emerald-600 mb-6" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Commission (15%)</p>
            <div className="text-6xl font-black text-slate-900 tracking-tighter">${data.stats.totalRevenueEarned?.toFixed(2) || 0}</div>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <Users size={32} className="text-blue-600 mb-6" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Active Tutors</p>
            <div className="text-6xl font-black text-slate-900 tracking-tighter">{data.stats.totalTeachers || 0}</div>
          </div>
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <ShieldAlert size={32} className="text-purple-600 mb-6" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Learners</p>
            <div className="text-6xl font-black text-slate-900 tracking-tighter">{data.stats.totalStudents || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <tr><th className="px-10 py-8">Teacher</th><th className="px-10 py-8">Status</th><th className="px-10 py-8 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.teachers.map(t => (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-10 font-black text-slate-900 text-xl">{t.name} <br/><span className="text-sm font-medium text-slate-400 uppercase tracking-widest">{t.teacherProfile.language}</span></td>
                  <td className="px-10 py-10">
                    <span className={`px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest border ${t.teacherProfile.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {t.teacherProfile.isApproved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-10 py-10 text-right">
                    <button onClick={() => toggleApprove(t._id, t.teacherProfile.isApproved)} className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest transition-all ${t.teacherProfile.isApproved ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}>
                      {t.teacherProfile.isApproved ? 'SUSPEND' : 'APPROVE'}
                    </button>
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