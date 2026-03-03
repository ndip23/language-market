import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Heart, MessageSquare, Settings, LogOut, Globe, Menu, X, Search } from 'lucide-react';
import axios from 'axios';

const StudentLayout = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0); // 🚨 Global Unread State
  const location = useLocation();
  const navigate = useNavigate();

  // 1. FETCH TOTAL UNREAD MESSAGES FOR BADGE
  const fetchTotalUnread = async () => {
    try {
        const res = await axios.get('/messages/unread/count', {
            headers: { 'x-auth-token': token }
        });
        const sum = res.data.reduce((acc, curr) => acc + curr.count, 0);
        setTotalUnread(sum);
    } catch (err) { console.log("Badge fetch failed"); }
  };

  useEffect(() => {
    if (token) {
        fetchTotalUnread();
        const interval = setInterval(fetchTotalUnread, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }
  }, [token]);

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard/student' },
    { name: 'Find Tutors', icon: <Search size={20}/>, path: '/dashboard/student/find' },
    { name: 'Lessons', icon: <BookOpen size={20}/>, path: '/dashboard/student/lessons' },
    { name: 'Saved', icon: <Heart size={20}/>, path: '/dashboard/student/saved' },
    { name: 'Messages', icon: <MessageSquare size={20}/>, path: '/dashboard/student/messages' },
    { name: 'Settings', icon: <Settings size={20}/>, path: '/dashboard/student/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 z-40 flex justify-between items-center px-6">
        <div className="flex items-center space-x-2 font-black text-slate-900 text-sm tracking-tighter">
            <div className="bg-emerald-600 p-1.5 rounded-lg text-white"><Globe size={16}/></div>
            <span>Portal.</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-emerald-600"><Menu size={20}/></button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-slate-900 text-white p-2 rounded-xl"><Globe size={20} /></div>
            <span className="text-xl font-black text-slate-900 tracking-tighter italic">LangConnect.</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400"><X size={20}/></button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menu.map((i) => {
            const isActive = location.pathname === i.path;
            return (
              <Link key={i.name} to={i.path} onClick={() => setSidebarOpen(false)} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isActive ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50'}`}>
                <div className="flex items-center space-x-4">
                  {i.icon} <span>{i.name}</span>
                </div>
                
                {/* 🚨 THE WHATSAPP BADGE ON SIDEBAR */}
                {i.name === 'Messages' && totalUnread > 0 && (
                    <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black shadow-sm animate-pulse italic">
                        {totalUnread} NEW
                    </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50 mt-auto">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all cursor-pointer">
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-12 mt-16 md:mt-0 w-full overflow-x-hidden">
        <Outlet />
      </main>
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] md:hidden"></div>}
    </div>
  );
};
export default StudentLayout;