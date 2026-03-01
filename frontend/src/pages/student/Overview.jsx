import { BookOpen, Star, MessageCircle, Clock } from 'lucide-react';

const Overview = () => {
  const stats = [
    { label: 'Upcoming Lessons', val: '3', icon: <Clock />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed Hours', val: '12.5', icon: <BookOpen />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tutors Saved', val: '8', icon: <Star />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Unread Messages', val: '2', icon: <MessageCircle />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.val}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">Next Lesson</h3>
          <div className="flex items-center p-6 bg-slate-50 rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136" className="w-16 h-16 rounded-2xl object-cover mr-6" />
            <div className="flex-1">
              <h4 className="font-black text-slate-900">Dr. Sarah Jenkins</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Advanced English • 2:00 PM Today</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest">Join</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;