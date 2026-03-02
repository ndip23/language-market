import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Sparkles, Eye, EyeOff, Globe, User, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';
import { SUPPORTED_REGIONS } from '../constants/regions';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', countryCode: 'CM',
    password: '', confirmPassword: '', role: 'student',
    language: 'English', pricePerLesson: '', termsAccepted: false
  });
  const location = useLocation();
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logic: Get current dial code
  const selectedRegion = SUPPORTED_REGIONS.find(r => r.code === formData.countryCode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Frontend Validations
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!formData.termsAccepted) {
      return toast.error("Please accept the Terms & Conditions");
    }

    setLoading(true);
    const tid = toast.loading('Creating elite account...');

    try {
      // 2. Format Mobile (Combine Dial Code + Digits)
      // e.g., selectedRegion.dialCode (+237) + formData.mobile (670000000)
      const fullMobile = `${selectedRegion.dialCode}${formData.mobile.replace(/\s+/g, '')}`;

      // 3. Prepare complete payload for backend
      const payload = {
        ...formData,
        mobile: fullMobile,
        countryCode: formData.countryCode
      };

      // 4. API Call to Register
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);

      // 5. Save to Context and LocalStorage
      login(res.data.user, res.data.token);

      // 6. SMART REDIRECT LOGIC
      // Check if user arrived here from a "Message Tutor" intent
      const returnTo = location.state?.returnTo;
      const tutorData = location.state?.selectedTutor;

      if (returnTo && tutorData) {
        toast.success(`Account created! Opening chat with ${tutorData.name}`, { id: tid });
        navigate(returnTo, { state: { selectedTutor: tutorData } });
      } else {
        toast.success('Welcome to LangConnect!', { id: tid });
        // Standard redirection based on role
        if (formData.role === 'teacher') {
          navigate('/dashboard/teacher');
        } else {
          navigate('/dashboard/student');
        }
      }

    } catch (err) {
      // Handle backend errors (e.g., Email already exists)
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error(errorMsg, { id: tid });
    } finally {
      setLoading(false);
    }
  };;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
      {loading && <Loader />}
      <div className="w-full max-w-xl bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
            <Sparkles size={12} className="mr-2" /> Start Your Journey
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
            <button type="button" onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-3.5 cursor-pointer rounded-xl text-xs font-black transition-all ${formData.role === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Student</button>
            <button type="button" onClick={() => setFormData({ ...formData, role: 'teacher' })}
              className={`flex-1 py-3.5 cursor-pointer rounded-xl text-xs font-black transition-all ${formData.role === 'teacher' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Teacher</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email Address" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold cursor-pointer"
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}>
                {SUPPORTED_REGIONS.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
              </select>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                  <span className="text-emerald-600 font-black text-xs tracking-tighter">{selectedRegion?.dialCode}</span>
                  <div className="w-px h-4 bg-slate-200"></div>
                </div>
                <input type="tel" placeholder="Mobile Number" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-18 pr-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold"
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </div>

            <div className="relative">
              <input type={showP ? "text" : "password"} placeholder="Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowP(!showP)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                {showP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input type={showCP ? "text" : "password"} placeholder="Confirm Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <button type="button" onClick={() => setShowCP(!showCP)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                {showCP ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {formData.role === 'teacher' && (
              <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-4">
                <select className="w-full bg-slate-50 border border-emerald-100 rounded-2xl px-6 py-4 font-black text-emerald-600 outline-none"
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                  <option value="English">I teach English</option><option value="French">I teach French</option>
                </select>
                <input type="number" placeholder="Price per lesson ($)" required className="w-full bg-slate-50 border rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-bold"
                  onChange={(e) => setFormData({ ...formData, pricePerLesson: e.target.value })} />
              </div>
            )}
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <input type="checkbox" required id="terms" checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} className="mt-1 w-5 h-5 accent-emerald-600 rounded cursor-pointer" />
            <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 leading-relaxed cursor-pointer uppercase tracking-widest">I agree to the <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span>.</label>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-slate-900 text-white font-black py-5 rounded-[1.8rem] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group uppercase tracking-[0.2em] text-[10px]"
          >
            <span>Create Account</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;