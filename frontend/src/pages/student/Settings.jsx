import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Camera, User, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';
import { SUPPORTED_REGIONS } from '../../constants/regions';

const Settings = () => {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [loading, setLoading] = useState(false);

  // LOGIC: Find region to strip dialCode for the input view
  const selectedRegion = SUPPORTED_REGIONS.find(r => r.code === user?.countryCode) || SUPPORTED_REGIONS[0];

  useEffect(() => {
    if (user) {
      // Logic: Strip the dial code (e.g. "+237") so user only sees their digits
      const cleanMobile = user.mobile?.replace(selectedRegion.dialCode, '') || '';
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: cleanMobile
      });
    }
  }, [user, selectedRegion]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading('Syncing changes...');
    try {
      // Logic: Prepend the dial code back for the database
      const fullMobile = `${selectedRegion.dialCode}${formData.mobile}`;

      const res = await axios.put('/auth/update-me', {
        ...formData,
        mobile: fullMobile
      }, { headers: { 'x-auth-token': token } });

      login(res.data, token); // Update global state
      toast.success('Account updated!', { id: tid });
    } catch (err) {
      toast.error('Update failed.', { id: tid });
    } finally { setLoading(false); }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    setLoading(true);
    try {
      const res = await axios.post('/upload/profile-pic', data, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      login(res.data, token); // res.data is the full user from our fixed backend
      toast.success('Avatar updated!');
    } catch (err) { toast.error('Upload failed'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700">
      {loading && <Loader />}
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-12 underline decoration-emerald-200 decoration-8 underline-offset-8">Settings</h2>

      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl space-y-12">
        <div className="flex items-center space-x-10 pb-12 border-b border-slate-50">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 bg-emerald-500 flex items-center justify-center">
              {user?.profilePicture ? <img src={user.profilePicture} className="w-full h-full object-cover" /> : <span className="text-white font-black text-4xl">{user?.name?.substring(0, 2).toUpperCase()}</span>}
              <label htmlFor="p-upload" className="absolute inset-0 bg-emerald-600/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
                <RefreshCw className="text-white mb-1" size={24} />
                <span className="text-[8px] text-white font-black uppercase">Change</span>
                <input id="p-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>
          <div><h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1 italic">Identity Avatar</h4><p className="text-slate-400 text-xs font-medium italic">Your public face on the marketplace.</p></div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Full Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Email Address</label>
              <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Verified Mobile</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                  <span className="text-emerald-500 font-black text-xs tracking-tighter">{selectedRegion.dialCode}</span>
                  <div className="w-px h-4 bg-slate-200"></div>
                </div>
                <input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl pl-18 pr-6 py-5 font-bold text-slate-900 outline-none focus:ring-2 ring-emerald-500/20" />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">Save Account Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;