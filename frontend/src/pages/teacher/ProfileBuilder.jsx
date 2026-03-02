import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TeacherPaywallView from '../../components/TeacherPaywallView';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileBuilder = () => {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ 
    bio: user?.teacherProfile?.bio || '', 
    pricePerLesson: user?.teacherProfile?.pricePerLesson || '', 
    language: user?.teacherProfile?.language || 'English' 
  });
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';

  if (!hasPlan) return <TeacherPaywallView title="Build your global" feature="Marketplace Identity" benefit="Showcase your expertise and pricing to thousands of learners. An elite profile is your key to more bookings." />;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Saving profile...");
    try {
      const res = await axios.put('http://localhost:5000/api/dashboard/teacher/profile', formData);
      login(res.data, token);
      toast.success("Profile Updated!", { id: tid });
    } catch (err) { toast.error("Error saving.", { id: tid }); }
  };

  return (
    <div className="max-w-4xl bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl space-y-12 animate-in fade-in">
      <form onSubmit={handleUpdate} className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Teacher Biography</label>
          <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 font-medium text-slate-900 outline-none focus:ring-2 ring-emerald-500/20 min-h-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input type="number" value={formData.pricePerLesson} onChange={e => setFormData({...formData, pricePerLesson: e.target.value})} className="bg-slate-50 p-6 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" placeholder="Hourly Rate ($)" />
            <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="bg-slate-50 p-6 rounded-2xl font-black text-slate-900 outline-none"><option>English</option><option>French</option></select>
        </div>
        <button type="submit" className="bg-emerald-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer">Sync to Marketplace</button>
      </form>
    </div>
  );
};
export default ProfileBuilder;