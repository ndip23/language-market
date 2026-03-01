import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Globe, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../components/Loader';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tid = toast.loading('Authenticating...');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Update Context
      login(res.data.user, res.data.token);
      
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`, { id: tid });

      // ROLE BASED REDIRECTION
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'teacher') navigate('/dashboard/teacher');
      else navigate('/dashboard/student');

    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid credentials', { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20">
      {loading && <FullPageLoader />}
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/30"><Globe size={28} /></div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-10 italic">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email Address" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400"
            onChange={(e) => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400"
              onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-xl shadow-emerald-600/20 group uppercase tracking-widest text-[10px]">
            Login to Portal <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            New here? <Link to="/register" className="text-emerald-600 border-b border-emerald-200">Create Account</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;