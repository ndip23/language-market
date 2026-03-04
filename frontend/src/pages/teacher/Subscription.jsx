import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Check, Zap, Crown, ShieldCheck, TrendingUp, Headphones, Globe } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';
import { SUPPORTED_REGIONS } from '../../constants/regions';

const TeacherSubscription = () => {
  const { user, token, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  // 🚨 1. IMPROVED VERIFICATION LOGIC
  useEffect(() => {
    const status = searchParams.get('status');
    const txnId = searchParams.get('transaction_id');
    const remark = searchParams.get('remark');

    if (status === 'success') {
      const verify = async () => {
        const tid = toast.loading("Finalizing your elite access...");
        try {
          // Fallback logic if Swychr strips data: 
          // Use user._id (standard MongoDB) or user.id
          const currentUserId = user?._id || user?.id;
          const finalRemark = remark || `SUB|basic|${currentUserId}`;
          const finalTxnId = txnId || 'LATEST';

          // 🚨 THE FIX: encodeURIComponent ensures the pipes (|) don't break the URL
          const res = await axios.get(`/payments/verify/${finalTxnId}?remark=${encodeURIComponent(finalRemark)}`);
          
          if (res.data.success) {
            // Fetch FRESH profile to get the new 'active' status and connection limits
            const updatedUser = await axios.get('/auth/me'); 
            login(updatedUser.data, token); 
            
            toast.success("Subscription Active! Welcome abroad.", { id: tid });
            
            // 🚨 THE FIX: Clean the URL immediately to prevent duplicate calls
            navigate('/dashboard/teacher', { replace: true });
          }
        } catch (err) {
          console.error("Verification Error:", err);
          // Don't show error immediately as the Webhook might still be processing
          toast.error("Verification pending. Please refresh the page.", { id: tid });
        }
      };

      // Only run verify if user data is loaded in context
      if (user) verify();
    }
  }, [searchParams, user, token, login, navigate]);
  
  // 🚨 2. RESPONSIVE PRICE DISPLAY LOGIC
  const region = SUPPORTED_REGIONS.find(r => r.code === user?.countryCode) || SUPPORTED_REGIONS[0];
  const [localPrices, setLocalPrices] = useState({ basic: '...', pro: '...' });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Correcting to 0.5 for the basic plan test
        const res5 = await axios.get(`/payments/rate?countryCode=${region.code}&amount=5`);
        const res10 = await axios.get(`/payments/rate?countryCode=${region.code}&amount=10`);
        
        setLocalPrices({
          basic: res5.data.localAmount.toLocaleString(),
          pro: res10.data.localAmount.toLocaleString()
        });
      } catch (err) {
        console.error("Conversion failed");
        setLocalPrices({ basic: '325', pro: '6,500' });
      }
    };
    if (token && user?.countryCode) fetchRates();
  }, [region, token, user]);

  const handleUpgrade = (planName, price) => {
      navigate('/dashboard/teacher/checkout', { 
          state: { plan: { name: planName, amount: price } } 
      });
  };

  const basicFeatures = [
    "6 Student Connections Monthly",
    "Standard Marketplace Listing",
    "Secure Direct Messaging",
    "Standard Profile Analytics",
    "Self-Managed Payments"
  ];

  const proFeatures = [
    "20 Student Connections Monthly",
    "Featured Priority Placement",
    "Verified Professional Badge",
    "Advanced Earnings Analytics",
    "Priority Technical Support",
    "Enhanced Profile Gallery"
  ];

  return (
    <div className="max-w-5xl animate-in fade-in duration-700 pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2">Professional Plans</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] underline decoration-emerald-500 decoration-4 underline-offset-8">Scale your teaching income</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        
        {/* BASIC PLAN */}
        <div className={`flex flex-col p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-2xl relative transition-all hover:border-emerald-500/30 ${user?.subscription?.plan === 'basic' ? 'ring-4 ring-emerald-500/10' : ''}`}>
          <div className="mb-8">
            <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-inner"><Zap size={24} /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Tutor Basic</h3>
            <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black text-slate-900">$5</span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">/ Month</span>
                </div>
                <p className="text-emerald-600 font-black text-[11px] uppercase tracking-tighter italic mt-1">Approx. {localPrices.basic} {region.currency}</p>
            </div>
          </div>
          <ul className="space-y-5 mb-12 flex-1">
            {basicFeatures.map((f, i) => (
                <li key={i} className="flex items-start">
                    <div className="bg-emerald-50 p-1 rounded-full mr-4 mt-0.5"><Check size={12} className="text-emerald-600" /></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">{f}</span>
                </li>
            ))}
          </ul>
          <button 
            disabled={user?.subscription?.plan === 'basic'}
            onClick={() => handleUpgrade('basic', 5)}
            className={`w-full py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${user?.subscription?.plan === 'basic' ? 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-95 cursor-pointer'}`}
          >
            {user?.subscription?.plan === 'basic' ? 'Current Active Plan' : 'Activate Basic'}
          </button>
        </div>

        {/* PRO PLAN */}
        <div className={`flex flex-col p-10 rounded-[3.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden transform lg:scale-105 transition-all border-4 border-emerald-500/20`}>
          <div className="absolute top-0 right-0 bg-emerald-500 text-white px-10 py-3 font-black text-[9px] tracking-[0.2em] rounded-bl-[2.5rem] shadow-lg animate-pulse text-center">MOST POPULAR</div>
          <div className="mb-8">
            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-inner"><Crown size={24} /></div>
            <h3 className="text-2xl font-black text-white mb-2 italic">Tutor Professional</h3>
            <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black text-white">$10</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ Month</span>
                </div>
                <p className="text-emerald-400 font-black text-[11px] uppercase tracking-tighter italic mt-1">Approx. {localPrices.pro} {region.currency}</p>
            </div>
          </div>
          <ul className="space-y-5 mb-12 flex-1">
            {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start">
                    <div className="bg-emerald-500/20 p-1 rounded-full mr-4 mt-0.5"><Check size={12} className="text-emerald-400" /></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-tight">{f}</span>
                </li>
            ))}
          </ul>
          <button 
             disabled={user?.subscription?.plan === 'pro'}
             onClick={() => handleUpgrade('pro', 10)}
             className={`w-full py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl ${user?.subscription?.plan === 'pro' ? 'bg-white/5 text-slate-500 cursor-not-allowed shadow-inner' : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 cursor-pointer'}`}
          >
            {user?.subscription?.plan === 'pro' ? 'Current Active Plan' : 'Activate Pro Status'}
          </button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
          <div className="flex items-center space-x-4">
            <ShieldCheck size={24} className="text-emerald-500" />
            <div><p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Safe Payments</p><p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">via Swychr Portal</p></div>
          </div>
          <div className="flex items-center space-x-4">
            <TrendingUp size={24} className="text-emerald-500" />
            <div><p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Instant Growth</p><p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Priority results</p></div>
          </div>
          <div className="flex items-center space-x-4">
            <Headphones size={24} className="text-emerald-500" />
            <div><p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">24/7 Support</p><p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Elite Member Care</p></div>
          </div>
      </div>
    </div>
  );
};

export default TeacherSubscription;