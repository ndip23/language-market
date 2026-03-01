import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Check, Zap, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../../components/Loader';

const TeacherSubscription = () => {
  const { user, token } = useContext(AuthContext);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUpgrade = async (plan) => {
    setIsRedirecting(true);
    const tid = toast.loading(`Connecting to AccountPe for ${plan} plan...`);
    
    try {
      // 1. Call your backend to get the Swychr Link
      const res = await axios.post('http://localhost:5000/api/payments/subscribe', 
        { plan }, 
        { headers: { 'x-auth-token': token } }
      );

      // 2. Redirect the Teacher to Swychr
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      toast.error("Gateway connection failed. Try again.", { id: tid });
      setIsRedirecting(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-700">
      {isRedirecting && <FullPageLoader />}
      
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-1">Teaching Capacity</h2>
        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">Upgrade to accept up to 20 students monthly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BASIC $5 */}
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl relative overflow-hidden">
          <Zap size={24} className="text-emerald-500 mb-4" />
          <h3 className="text-lg font-black text-slate-900 mb-1">Basic</h3>
          <div className="text-3xl font-black text-slate-900 mb-6">$5<span className="text-[10px] text-slate-300">/mo</span></div>
          <button 
            onClick={() => handleUpgrade('basic')}
            className="w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-widest bg-slate-900 text-white hover:bg-emerald-600 transition-all cursor-pointer"
          >
            {user?.subscription?.plan === 'basic' ? 'Current Plan' : 'Pay $5 Now'}
          </button>
        </div>

        {/* PRO $10 */}
        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-all">
          <Crown size={24} className="text-emerald-500 mb-4" />
          <h3 className="text-lg font-black mb-1">Professional</h3>
          <div className="text-3xl font-black mb-6">$10<span className="text-[10px] text-slate-500">/mo</span></div>
          <button 
            onClick={() => handleUpgrade('pro')}
            className="w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl cursor-pointer"
          >
            {user?.subscription?.plan === 'pro' ? 'Current Plan' : 'Pay $10 Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubscription;