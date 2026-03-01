import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Save, Globe, DollarSign, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';

const ProfileBuilder = () => {
  const { user, token, login } = useContext(AuthContext);
  
  // 1. Local State for Form
  const [formData, setFormData] = useState({
    bio: '',
    pricePerLesson: '',
    language: 'English'
  });
  const [loading, setLoading] = useState(false);

  // 2. Pre-fill form with existing data
  useEffect(() => {
    if (user?.teacherProfile) {
      setFormData({
        bio: user.teacherProfile.bio || '',
        pricePerLesson: user.teacherProfile.pricePerLesson || '',
        language: user.teacherProfile.language || 'English'
      });
    }
  }, [user]);

  // 3. Handle the Save Action
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading("Syncing with marketplace...");

    try {
      const res = await axios.put('http://localhost:5000/api/dashboard/teacher/profile', formData, {
        headers: { 'x-auth-token': token }
      });

      // Update the global context so changes reflect everywhere instantly
      login(res.data, token); 
      
      toast.success("Marketplace profile updated!", { id: tid });
    } catch (err) {
      toast.error("Failed to update profile.", { id: tid });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700">
      {loading && <FullPageLoader />}
      
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2 text-left">Profile Builder</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] text-left">This content is visible to all students</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl space-y-12">
        
        {/* BIO SECTION */}
        <div className="space-y-4">
          <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">
            <BookOpen size={14} className="mr-2 text-emerald-500" /> Professional Biography
          </label>
          <textarea 
            required
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-slate-50 border-none rounded-[2.5rem] p-8 font-medium text-slate-900 outline-none focus:ring-2 ring-emerald-500/20 min-h-[250px] transition-all"
            placeholder="Introduce yourself to potential students. Mention your teaching style and experience..."
          ></textarea>
        </div>

        {/* PRICE & LANGUAGE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">
              <DollarSign size={14} className="mr-2 text-emerald-500" /> Hourly Rate ($)
            </label>
            <input 
              type="number" 
              required
              value={formData.pricePerLesson}
              onChange={(e) => setFormData({...formData, pricePerLesson: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl p-6 font-black text-slate-900 outline-none focus:ring-2 ring-emerald-500/20 transition-all" 
              placeholder="e.g. 25"
            />
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">
              <Globe size={14} className="mr-2 text-emerald-500" /> Primary Language
            </label>
            <div className="relative">
              <select 
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl p-6 font-black text-slate-900 outline-none focus:ring-2 ring-emerald-500/20 appearance-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="French">French</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">▼</div>
            </div>
          </div>
        </div>

        {/* THE BUTTON - Fixed with cursor-pointer and hover effects */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="group relative bg-emerald-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center"
          >
            <Save size={18} className="mr-3 group-hover:rotate-12 transition-transform" />
            Update Marketplace Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileBuilder;