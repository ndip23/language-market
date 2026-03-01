import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../components/Loader';

const Register = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'student', language:'English', pricePerLesson:'' });
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    const tid = toast.loading('Creating account...');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      await login(formData.email, formData.password);
      toast.success('Account Ready!', { id: tid });
      navigate(formData.role === 'teacher' ? '/dashboard/teacher' : '/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error', { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
      {loading && <FullPageLoader />}
      <div className="w-full max-w-lg bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"><Sparkles size={14} className="mr-2"/>Luxury Marketplace</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4">
            <button type="button" onClick={() => setFormData({...formData, role:'student'})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${formData.role==='student' ? 'bg-white text-emerald-600 shadow-sm':'text-slate-400'}`}>Student</button>
            <button type="button" onClick={() => setFormData({...formData, role:'teacher'})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${formData.role==='teacher' ? 'bg-white text-emerald-600 shadow-sm':'text-slate-400'}`}>Teacher</button>
          </div>
          <input type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-semibold text-slate-900 placeholder-slate-400" onChange={(e)=>setFormData({...formData, name:e.target.value})}/>
          <input type="email" placeholder="Email Address" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-semibold text-slate-900 placeholder-slate-400" onChange={(e)=>setFormData({...formData, email:e.target.value})}/>
          
          <div className="relative">
            <input type={showP ? "text":"password"} placeholder="Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-semibold text-slate-900 placeholder-slate-400" onChange={(e)=>setFormData({...formData, password:e.target.value})}/>
            <button type="button" onClick={()=>setShowP(!showP)} className="absolute right-6 top-4 text-slate-400 hover:text-emerald-600">{showP ? <EyeOff size={20}/>:<Eye size={20}/>}</button>
          </div>
          
          <div className="relative">
            <input type={showCP ? "text":"password"} placeholder="Confirm Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-semibold text-slate-900 placeholder-slate-400" onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})}/>
            <button type="button" onClick={()=>setShowCP(!showCP)} className="absolute right-6 top-4 text-slate-400 hover:text-emerald-600">{showCP ? <EyeOff size={20}/>:<Eye size={20}/>}</button>
          </div>

          {formData.role === 'teacher' && (
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-4">
              <select className="w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold text-slate-900 appearance-none outline-none focus:border-emerald-500" onChange={(e)=>setFormData({...formData, language:e.target.value})}>
                <option value="English">I teach English</option><option value="French">I teach French</option>
              </select>
              <input type="number" placeholder="Price per lesson ($)" required className="w-full bg-slate-50 border rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-semibold" onChange={(e)=>setFormData({...formData, pricePerLesson:e.target.value})}/>
            </div>
          )}
          <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-3xl mt-6 shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 uppercase tracking-widest text-[10px]">Create Account</button>
        </form>
      </div>
    </div>
  );
};
export default Register;