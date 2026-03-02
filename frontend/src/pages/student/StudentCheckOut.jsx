import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, CreditCard, ShieldCheck, Globe, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';
import { SUPPORTED_REGIONS } from '../../constants/regions';

const StudentCheckout = () => {
  const { user, token } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [localAmount, setLocalAmount] = useState('...');
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);

  const lessonData = state || { teacherName: 'Tutor', price: 20 };
  const region = SUPPORTED_REGIONS.find(r => r.code === user?.countryCode) || SUPPORTED_REGIONS[0];

  useEffect(() => {
    const getRate = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payments/rate?countryCode=${region.code}&amount=${lessonData.price}`);
        setLocalAmount(res.data.localAmount);
      } catch (err) {
        setLocalAmount(Math.ceil(lessonData.price * 650)); 
      } finally { setFetching(false); }
    };
    if (user?.countryCode) getRate();
  }, [region, lessonData, user]);

  const handleFinalPayment = async () => {
    setProcessing(true);
    const tid = toast.loading("Confirming Order...");
    try {
      const res = await axios.post('http://localhost:5000/api/payments/lesson', {
        teacherId: lessonData.teacherId,
        amount: localAmount,
        connectionId: lessonData.connectionId,
        countryCode: region.code,
        mobile: user.mobile,
        currency: region.currency
      });
      if (res.data.paymentUrl) window.location.href = res.data.paymentUrl;
    } catch (err) {
      setProcessing(false);
      toast.error("Gateway error", { id: tid });
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-700 pb-10">
      {processing && <FullPageLoader message="Opening Secure Payment Portal..." />}
      
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 font-black text-[9px] uppercase tracking-widest mb-6 md:mb-10">
        <ArrowLeft size={14} className="mr-2" /> Cancel Booking
      </button>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border border-slate-100 shadow-2xl space-y-8 md:space-y-10">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter underline decoration-emerald-500 decoration-4 underline-offset-8">Order Summary</h1>

        <div className="bg-slate-50 rounded-3xl p-6 md:p-8 flex items-center space-x-4 md:space-x-6">
           <div className="bg-emerald-500 text-white p-3 md:p-4 rounded-xl shadow-lg shadow-emerald-500/20"><User size={20} /></div>
           <div>
                <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 text-left italic">Tutor Session</p>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight capitalize">{lessonData.teacherName}</h2>
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              <span>Location</span>
              <span className="text-slate-900 flex items-center font-bold tracking-tight"><Globe size={14} className="mr-2 text-emerald-500" /> {region.name}</span>
           </div>
           <div className="h-px bg-slate-100"></div>
           <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
              <span className="text-slate-900 font-black text-base md:text-lg italic self-start md:self-auto mb-4 md:mb-0">Total Payable</span>
              <div className="text-right w-full md:w-auto">
                <p className="text-4xl md:text-6xl font-black text-emerald-600 tracking-tighter">
                    {fetching ? '...' : `${localAmount.toLocaleString()} ${region.currency}`}
                </p>
                <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest">Base Rate: ${lessonData.price}.00 USD</p>
              </div>
           </div>
        </div>

        <button onClick={handleFinalPayment} className="w-full bg-slate-900 text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center active:scale-95 cursor-pointer">
            <CreditCard size={18} className="mr-3" /> Pay Now
        </button>

        <div className="flex flex-col items-center space-y-4 opacity-50">
            <div className="flex items-center space-x-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Secured by Swychr Encryption</span>
            </div>
        </div>
      </div>
    </div>
  );
};
export default StudentCheckout;