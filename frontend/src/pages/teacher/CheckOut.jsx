import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, CreditCard, Globe, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';
import { SUPPORTED_REGIONS } from '../../constants/regions';

const Checkout = () => {
  const { user, token } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [localAmount, setLocalAmount] = useState('...');
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);

  const plan = state?.plan || { name: 'basic', amount: 5 };
  const region = SUPPORTED_REGIONS.find(r => r.code === user?.countryCode) || SUPPORTED_REGIONS[0];

  useEffect(() => {
    const getRate = async () => {
      try {
        const res = await axios.get(`/payments/rate?countryCode=${region.code}&amount=${plan.amount}`);
        setLocalAmount(res.data.localAmount);
      } catch (err) {
        setLocalAmount(Math.ceil(plan.amount * 650)); 
      } finally { setFetching(false); }
    };
    if (user?.countryCode) getRate();
  }, [region, plan, user]);

  const handleFinalPayment = async () => {
    setProcessing(true);
    const tid = toast.loading("Confirming Order with Swychr...");
    try {
      const res = await axios.post('/payments/subscribe', {
        plan: plan.name.toLowerCase(),
        countryCode: region.code,
        mobile: user.mobile,
        currency: region.currency
      });
      if (res.data.paymentUrl) window.location.href = res.data.paymentUrl;
    } catch (err) {
      setProcessing(false);
      toast.error("Checkout failed", { id: tid });
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 md:pt-10 pb-20 px-4 md:px-6 animate-in fade-in duration-700">
      {processing && <FullPageLoader message="Generating Secure Payment Link..." />}
      
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-6 md:mb-10 hover:text-emerald-600 transition-all cursor-pointer">
        <ArrowLeft size={14} className="mr-2" /> Change Plan
      </button>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 border border-slate-100 shadow-2xl space-y-8 md:space-y-10">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter underline decoration-emerald-500 decoration-4 md:decoration-8 underline-offset-8 mb-4">Order Summary</h1>

        {/* Plan Box - Responsive padding */}
        <div className="bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100">
           <p className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Subscription Tier</p>
           <h2 className="text-xl md:text-2xl font-black text-slate-900 italic capitalize">Tutor {plan.name}</h2>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 px-1 md:px-2">
              <span>Payment Location</span>
              <span className="text-slate-900 flex items-center"><Globe size={14} className="mr-1.5 md:mr-2 text-emerald-500" /> {region.name}</span>
           </div>
           
           <div className="h-px bg-slate-100"></div>
           
           {/* Total Payable - Stacks on small mobile */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-1 md:px-2 space-y-4 md:space-y-0">
              <span className="text-slate-900 font-black text-base md:text-lg italic uppercase tracking-tighter">Total Payable</span>
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-600 tracking-tighter leading-none">
                    {fetching ? '...' : `${localAmount.toLocaleString()} ${region.currency}`}
                </p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">Base Rate: ${plan.amount.toFixed(2)} USD</p>
              </div>
           </div>
        </div>

        {/* Main Button - Scaled for mobile touch */}
        <button 
            onClick={handleFinalPayment}
            disabled={fetching}
            className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-xl md:rounded-[1.8rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center active:scale-95 cursor-pointer disabled:opacity-50"
        >
            <CreditCard size={18} className="mr-3 shrink-0" /> 
            <span className="truncate">Pay Now — {fetching ? '...' : localAmount.toLocaleString()} {region.currency}</span>
        </button>

        <div className="flex items-center justify-center space-x-3 opacity-50 px-2 text-center">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Swychr Transaction</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;