import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCircle, 
  CreditCard, MessageSquare, Settings, LogOut, Globe, ShieldCheck, Menu, X 
} from 'lucide-react';
import axios from 'axios';

const TeacherLayout = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. REVENUE LOGIC: Connections used vs limit
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';
  const used = user?.subscription?.currentConnections || 0;
  const limit = user?.subscription?.studentLimit || 0;
  const progress = limit > 0 ? (used / limit) * 100 : 0;

  // 2. FETCH UNREAD MESSAGES
  const fetchTotalUnread = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/messages/unread/count', {
            headers: { 'x-auth-token': token }
        });
        const sum = res.data.reduce((acc, curr) => acc + curr.count, 0);
        setTotalUnread(sum);
    } catch (err) { console.log("Badge fail"); }
  };

  useEffect(() => {
    if (token) {
        fetchTotalUnread();
        const interval = setInterval(fetchTotalUnread, 15000);
        return () => clearInterval(interval);
    }
  }, [token]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18}/>, path: '/dashboard/teacher' },
    { name: 'My Students', icon: <Users size={18}/>, path: '/dashboard/teacher/students' },
    { name: 'Profile Builder', icon: <UserCircle size={18}/>, path: '/dashboard/teacher/profile' },
    { name: 'Subscription', icon: <CreditCard size={18}/>, path: '/dashboard/teacher/subscription' },
    { name: 'Messages', icon: <MessageSquare size={18}/>, path: '/dashboard/teacher/messages' },
    { name: 'Settings', icon: <Settings size={18}/>, path: '/dashboard/teacher/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 z-40 flex justify-between items-center px-6">
        <span className="font-black text-slate-900 tracking-tighter uppercase text-xs italic">Console.</span>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-900"><Menu size={20}/></button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2"><div className="bg-slate-900 text-white p-1.5 rounded-lg"><Globe size={18} /></div><span className="text-xl font-black text-slate-900 italic tracking-tighter">LangConnect.</span></Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400"><X size={20}/></button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${location.pathname === item.path ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-3">{item.icon} <span>{item.name}</span></div>
              
              {/* 🚨 WHATSAPP BADGE FOR TEACHER */}
              {item.name === 'Messages' && totalUnread > 0 && (
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black italic shadow-sm ${location.pathname === item.path ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white animate-bounce'}`}>
                    {totalUnread} NEW
                  </span>
              )}
            </Link>
          ))}
        </nav>

        {/* SUBSCRIPTION PROGRESS CARD */}
        <div className="px-6 mb-6 mt-4">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 italic">Monthly Limit</p>
                <p className="text-sm font-black uppercase text-emerald-400">{hasPlan ? user.subscription.plan : 'Required'}</p>
                {!hasPlan ? (
                    <Link to="/dashboard/teacher/subscription" className="mt-4 block bg-emerald-600 text-center py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Activate</Link>
                ) : (
                    <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 border-t mt-auto">
          <button onClick={logout} className="w-full flex items-center space-x-3 px-5 py-4 rounded-xl font-black text-[10px] uppercase text-red-500 hover:bg-red-50 cursor-pointer transition-all"><LogOut size={18}/><span>Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 mt-16 md:mt-0 w-full">
        <div className="animate-in fade-in duration-700"><Outlet /></div>
      </main>

      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] md:hidden"></div>}
    </div>
  );
};
export default TeacherLayout;