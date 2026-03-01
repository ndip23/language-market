import { TrendingUp, Users, Star, DollarSign } from 'lucide-react';

const TeacherDashboard = () => {
  const stats = [
    { label: 'Monthly Earnings', val: '$450.00', icon: <DollarSign />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Students', val: '12', icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Rating', val: '4.9', icon: <Star />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Growth', val: '+24%', icon: <TrendingUp />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>{s.icon}</div>
            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{s.val}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-8 italic underline decoration-emerald-200">Recent Activity</h3>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center py-10">No new alerts this morning.</p>
      </div>
    </div>
  );
};

export default TeacherDashboard;