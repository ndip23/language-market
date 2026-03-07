import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  ArrowRight, Sparkles, Eye, EyeOff, Globe, Phone,
  ShieldCheck, Scale, Check, AlertTriangle,
  DollarSign, Award, Zap, Coins, UserCheck, User, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../components/Loader';
import { SUPPORTED_REGIONS } from '../constants/regions';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', countryCode: 'CM',
    password: '', confirmPassword: '', role: 'student',
    language: 'English', pricePerLesson: '', termsAccepted: false
  });

  const [showRules, setShowRules] = useState(false); // 🚨 State for Rules Gate
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRegion = SUPPORTED_REGIONS.find(r => r.code === formData.countryCode) || SUPPORTED_REGIONS[0];

  // 🚨 Handle button click (Intercepts Teacher registration to show rules)
  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    if (!formData.termsAccepted) return toast.error("Please accept the Terms & Conditions");

    if (formData.role === 'teacher') {
      setShowRules(true);
    } else {
      executeRegister();
    }
  };

  // 🚨 Actual creation logic
  const executeRegister = async () => {
    setLoading(true);
    setShowRules(false);
    const tid = toast.loading('Architecting elite profile...');

    try {
      const fullMobile = `${selectedRegion.dialCode}${formData.mobile.replace(/\s+/g, '')}`;
      const payload = { ...formData, mobile: fullMobile };

      const res = await axios.post('/auth/register', payload);
      login(res.data.user, res.data.token);

      const returnTo = location.state?.returnTo;
      const tutorData = location.state?.selectedTutor;

      if (returnTo && tutorData) {
        toast.success(`Opening chat with ${tutorData.name}`, { id: tid });
        navigate(returnTo, { state: { selectedTutor: tutorData } });
      } else {
        toast.success('Welcome to LangConnect!', { id: tid });
        navigate(formData.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed', { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24 md:py-32">
      {loading && <FullPageLoader message="Verifying Identity..." />}

      {/* 🚨 TEACHER RULES MODAL */}
      {showRules && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-50 border-b text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-white"><Scale size={24} /></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic leading-tight">Teacher Protocol & Rules</h2>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1 italic">Read carefully before continuing</p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {[
                {
                  icon: <DollarSign className="text-emerald-600" />,
                  title: "1. Earnings Policy",
                  content: "100% of the money you earn belongs to you. You are free to set your own price, choose your own schedule, and decide how you receive your payments (PayPal, Mobile Money, Bank Transfer, etc). We do not interfere with your pricing or methods."
                },
                {
                  icon: <Zap className="text-emerald-600" />,
                  title: "2. Package-Based Allocation",
                  content: "Visibility and student matching priority are determined by your purchased package. While higher tiers receive significantly higher exposure, packages increase visibility and do not guarantee a fixed number of students."
                },
                {
                  icon: <Coins className="text-emerald-600" />,
                  title: "3. Optional Internal Payments",
                  content: "If you choose our internal system, we handle processing and quality control for a 15% commission per transaction. This provides additional structure and payment security."
                },
                {
                  icon: <ShieldCheck className="text-emerald-600" />,
                  title: "4. Independent Payment Option",
                  content: "Teachers preferring external management keep 100% of their earnings. Our responsibility remains providing student visibility and matching based on your package."
                },
                {
                  icon: <UserCheck className="text-emerald-600" />,
                  title: "5. Approval Process",
                  content: "Profiles are reviewed within 24–48 hours after signup and package purchase. This ensures platform quality and professional standards for our students."
                },
                {
                  icon: <Award className="text-emerald-600" />,
                  title: "6. Professional Conduct",
                  content: "Tutors must be punctual, deliver the full agreed duration, and maintain respectful communication. Failure to comply may result in account suspension."
                },
                {
                  icon: <AlertTriangle className="text-emerald-600" />,
                  title: "7. No Student Poaching",
                  content: "Redirecting students outside the platform to bypass policies or misrepresenting services is strictly prohibited and results in permanent suspension."
                },
                {
                  icon: <Scale className="text-emerald-600" />,
                  title: "8. Refund Policy",
                  content: "Teacher packages are non-refundable after profile approval. Packages provide increased exposure and matching priority only."
                }
              ].map((r, i) => (
                <div key={i} className="flex space-x-4 items-start">
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0 shadow-sm">{r.icon}</div>
                  <div><h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-0.5">{r.title}</h4><p className="text-slate-500 text-xs font-medium leading-relaxed italic">{r.content}</p></div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50 border-t flex flex-col md:flex-row gap-4 items-center">
              <button onClick={() => setShowRules(false)} className="order-2 md:order-1 text-slate-400 font-black text-[10px] uppercase tracking-widest px-6 cursor-pointer">Cancel</button>
              <button onClick={executeRegister} className="order-1 md:order-2 flex-1 w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer">
                Accept & Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION FORM */}
      <div className="w-full max-w-xl bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-emerald-100 italic">
            <Sparkles size={12} className="mr-2" /> Start Your Journey
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Create Account</h1>
        </div>

        <form onSubmit={handlePreSubmit} className="space-y-5">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-8 border border-slate-200">
            <button type="button" onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${formData.role === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Student</button>
            <button type="button" onClick={() => setFormData({ ...formData, role: 'teacher' })}
              className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${formData.role === 'teacher' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Teacher</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400 shadow-inner"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email Address" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold placeholder-slate-400 shadow-inner"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold cursor-pointer appearance-none"
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}>
                {SUPPORTED_REGIONS.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
              </select>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                  <span className="text-emerald-600 font-black text-xs tracking-tighter">{selectedRegion?.dialCode}</span>
                  <div className="w-px h-4 bg-slate-200"></div>
                </div>
                <input type="tel" placeholder="Mobile" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-18 pr-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold shadow-inner"
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </div>

            <div className="relative">
              <input type={showP ? "text" : "password"} placeholder="Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold shadow-inner"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowP(!showP)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                {showP ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input type={showCP ? "text" : "password"} placeholder="Confirm Password" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 text-slate-900 font-bold shadow-inner"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              <button type="button" onClick={() => setShowCP(!showCP)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors">
                {showCP ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {formData.role === 'teacher' && (
              <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <select className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 font-black text-emerald-600 outline-none appearance-none"
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
                  <option value="English">I teach English</option><option value="French">I teach French</option>
                </select>
                <input type="number" placeholder="Price per lesson ($)" required className="w-full bg-slate-50 border rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-bold shadow-inner"
                  onChange={(e) => setFormData({ ...formData, pricePerLesson: e.target.value })} />
              </div>
            )}
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <input type="checkbox" required id="terms" checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} className="mt-1 w-5 h-5 accent-emerald-600 rounded cursor-pointer shrink-0" />
            <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 leading-relaxed cursor-pointer uppercase tracking-widest italic">I agree to the <span className="text-emerald-600 underline">Terms</span> and <span className="text-emerald-600 underline">Privacy Policy</span>.</label>
          </div>

          {/* BALANCED CENTERED BUTTON */}
          <button
            type="submit"
            className="w-full mt-6 bg-slate-900 text-white py-5 rounded-[1.8rem] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-95 group uppercase font-black text-[10px] tracking-widest cursor-pointer"
          >
            <span>{formData.role === 'teacher' ? 'Review Protocol' : 'Create Account'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="pl-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already Have an account? <Link to="/login" className="text-emerald-600 hover:underline">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;