import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
  TrendingUp, Users, Star, DollarSign, 
  ArrowUpRight, ShieldCheck, Wallet, Clock
} from 'lucide-react';
import TeacherPaywallView from '../../components/TeacherPaywallView';
import toast from 'react-hot-toast';
import { Loader, FullPageLoader } from '../../components/Loader';

const TeacherDashboard = () => {
  const { user, token, login } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({ amount: '', method: '', account: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. REVENUE GATE: Check if teacher has an active plan
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';

  useEffect(() => {
    const fetchData = async () => {
      if (!hasPlan) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Fetch Live Stats
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/teacher/stats', config);
        setStats(statsRes.data);

        // Fetch Dynamic Payout Methods (Swychr Aware)
        const methodsRes = await axios.get('http://localhost:5000/api/payments/methods', config);
        setPayoutMethods(methodsRes.data);
      } catch (err) {
        console.error("Dashboard Sync Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hasPlan, token]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (Number(withdrawalData.amount) > stats.balance) return toast.error("Insufficient funds");

    setIsProcessing(true);
    const tid = toast.loading("Connecting to Payout Engine...");
    try {
      const res = await axios.post('http://localhost:5000/api/payments/withdraw', withdrawalData, {
        headers: { 'x-auth-token': token }
      });
      // Update balance locally
      setStats({ ...stats, balance: res.data.balance });
      toast.success("Withdrawal successful! Check your local account.", { id: tid });
      setShowWithdrawForm(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Gateway Error", { id: tid });
    } finally { setIsProcessing(false); }
  };

  // IF NO PLAN: Show the enticing activation screen
  if (!hasPlan) return (
    <TeacherPaywallView 
      title="Ready to track your" 
      feature="Earnings & Growth" 
      benefit="Activate your plan to unlock real-time revenue analytics, student management tools, and instant withdrawals." 
    />
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20">
      {isProcessing && <FullPageLoader message="Securing Transaction..." />}

      {/* WALLET SECTION - Responsive Dark Card */}
      <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-emerald-500/10 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-emerald-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-4 italic">
            <Wallet size={14} /> <span>Available Balance</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-10">
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter">${stats?.balance?.toFixed(2)}</h2>
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 md:mb-4">Net Share (85%)</span>
          </div>

          {!showWithdrawForm ? (
            <button 
              onClick={() => setShowWithdrawForm(true)}
              className="w-full md:w-auto bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center"
            >
              Withdraw Funds <ArrowUpRight size={18} className="ml-2" />
            </button>
          ) : (
            <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Method</label>
                    <select required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-black uppercase text-white outline-none focus:ring-2 ring-emerald-500/50"
                        onChange={(e) => setWithdrawalData({...withdrawalData, methodCode: e.target.value})}>
                        <option value="" className="text-slate-900">Choose Provider</option>
                        {payoutMethods.map(m => <option key={m.code} value={m.code} className="text-slate-900">{m.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Account</label>
                    <input type="text" required placeholder="Account/Phone" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-black text-white outline-none focus:ring-2 ring-emerald-500/50"
                        onChange={(e) => setWithdrawalData({...withdrawalData, accountNumber: e.target.value})} />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                    <input type="number" required placeholder="Amount" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs font-black text-white outline-none"
                        onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})} />
                    <div className="flex space-x-2">
                        <button type="submit" className="flex-1 bg-white text-slate-900 py-4 rounded-xl font-black text-[9px] uppercase hover:bg-emerald-500 transition-all">Confirm</button>
                        <button type="button" onClick={() => setShowWithdrawForm(false)} className="px-6 py-4 rounded-xl font-black text-[9px] uppercase text-slate-400">Cancel</button>
                    </div>
                </div>
            </form>
          )}
        </div>
      </div>

      {/* STATS GRID - Responsive (1 col mobile, 2 col tablet, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
            { label: 'Platform Rating', val: stats?.rating, icon: <Star />, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Total Students', val: stats?.totalStudents, icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Requests', val: stats?.pendingRequests, icon: <Clock />, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Gross Revenue', val: `$${stats?.totalEarnings}`, icon: <TrendingUp />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
            <div className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{s.icon}</div>
            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter italic">{s.val}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FOOTER INFO */}
      <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between shadow-sm space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
              <ShieldCheck className="text-emerald-500" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic text-center md:text-left">
                  Account status: {user?.teacherProfile?.isApproved ? 'Professional Verified' : 'Vetting in progress'}
              </p>
          </div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest underline decoration-2 underline-offset-4">
              Next Reset: {new Date(user?.subscription?.activeUntil).toLocaleDateString()}
          </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;