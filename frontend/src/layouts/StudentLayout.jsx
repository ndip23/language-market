import { useState, useContext } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Heart, MessageSquare, Settings, LogOut, Globe, Menu, X } from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: 'Overview', icon: <LayoutDashboard size={20}/>, path: '/dashboard/student' },
    { name: 'Lessons', icon: <BookOpen size={20}/>, path: '/dashboard/student/lessons' },
    { name: 'Saved', icon: <Heart size={20}/>, path: '/dashboard/student/saved' },
    { name: 'Messages', icon: <MessageSquare size={20}/>, path: '/dashboard/student/messages' },
    { name: 'Settings', icon: <Settings size={20}/>, path: '/dashboard/student/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b p-4 z-40 flex justify-between items-center px-6">
        <span className="font-black text-slate-900 tracking-tighter">LangConnect.</span>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl"><Menu size={20}/></button>
      </div>

      {/* Responsive Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2"><div className="bg-emerald-600 p-2 rounded-xl text-white"><Globe size={20}/></div><span className="font-black text-slate-900 tracking-tighter">LangConnect.</span></Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><X/></button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menu.map(i => (
            <Link key={i.name} to={i.path} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${location.pathname === i.path ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              {i.icon} <span>{i.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t mt-auto">
          <button onClick={logout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 cursor-pointer transition-all"><LogOut size={20}/> <span>Sign Out</span></button>
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