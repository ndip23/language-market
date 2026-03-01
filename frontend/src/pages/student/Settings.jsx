import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Camera, User, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';

const Settings = () => {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  // Handle Name/Email update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading('Saving profile...');
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update-me', formData, { 
        headers: { 'x-auth-token': token } 
      });
      login(res.data, token); // Update global memory
      toast.success('Profile saved!', { id: tid });
    } catch (err) {
      toast.error('Update failed.', { id: tid });
    } finally { setLoading(false); }
  };

  // Handle Profile Picture Change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    
    setLoading(true);
    const tid = toast.loading('Uploading to cloud...');
    try {
      const res = await axios.post('http://localhost:5000/api/upload/profile-pic', data, { 
        headers: { 
          'x-auth-token': token, 
          'Content-Type': 'multipart/form-data' 
        } 
      });
      
      // IMPORTANT: res.data is the full updated user from the backend
      login(res.data, token); 
      
      toast.success('Avatar updated!', { id: tid });
    } catch (err) { 
      toast.error('Upload failed.', { id: tid }); 
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700">
      {loading && <FullPageLoader />}
      
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-12">Settings</h2>
      
      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl space-y-16">
        
        {/* AVATAR SECTION */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 pb-16 border-b border-slate-50">
          <div className="relative group shrink-0">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-slate-50 bg-emerald-500 flex items-center justify-center shadow-2xl">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                    <span className="text-white font-black text-6xl">{user?.name?.substring(0, 2).toUpperCase()}</span>
                )}
                
                {/* Hover Overlay */}
                <label htmlFor="change-pic" className="absolute inset-0 bg-emerald-600/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                  <RefreshCw className="text-white mb-2 animate-spin-slow" size={32} />
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Change Photo</span>
                </label>
            </div>
            <input id="change-pic" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">Elite Identity</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Your photo is visible to tutors. A professional photo increases booking rates by 40%.
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Full Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-14 py-5 font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-14 py-5 font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" 
                />
              </div>
            </div>
            
            <div className="md:col-span-2 pt-6">
                <button type="submit" className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
                    Update Account Details
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;