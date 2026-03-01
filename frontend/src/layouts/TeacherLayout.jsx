import { useState, useContext } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserCircle, 
  CreditCard, MessageSquare, Settings, LogOut, Globe, ShieldCheck, Menu, X 
} from 'lucide-react';

const TeacherLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Unified Menu Items for Teachers
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18}/>, path: '/dashboard/teacher' },
    { name: 'My Students', icon: <Users size={18}/>, path: '/dashboard/teacher/students' },
    { name: 'Profile Builder', icon: <UserCircle size={18}/>, path: '/dashboard/teacher/profile' },
    { name: 'Subscription', icon: <CreditCard size={18}/>, path: '/dashboard/teacher/subscription' },
    { name: 'Messages', icon: <MessageSquare size={18}/>, path: '/dashboard/teacher/messages' },
    { name: 'Account Settings', icon: <Settings size={18}/>, path: '/dashboard/teacher/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Logic for the Student Limit Progress Bar
  const used = user?.subscription?.currentConnections || 0;
  const limit = user?.subscription?.studentLimit || 0;
  const progressWidth = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* 1. MOBILE HEADER - Only visible on small screens */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 z-40 flex justify-between items-center px-6">
        <div className="flex items-center space-x-2 font-black text-slate-900 text-sm tracking-tighter uppercase italic">
            <div className="bg-slate-900 p-1 rounded-lg text-white"><Globe size={14}/></div>
            <span>LangConnect.</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-900">
            <Menu size={20}/>
        </button>
      </div>

      {/* 2. SIDEBAR - Responsive Logic */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out
        md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Logo Section */}
        <div className="p-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-slate-900 text-white p-2 rounded-xl">
              <Globe size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 italic">Console.</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
            <X size={20}/>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  isActive 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* SUBSCRIPTION METER (Requirement: Track 6/20 limit) */}
        <div className="px-6 mb-6">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 italic">Monthly Capacity</p>
                <p className="text-sm font-black uppercase tracking-tighter text-emerald-400">
                    {user?.subscription?.plan === 'none' ? 'Free Access' : user?.subscription?.plan + ' Plan'}
                </p>
                
                {/* Visual Bar */}
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${progressWidth >= 100 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${progressWidth}%` }}
                    ></div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                        {used} / {limit} Students
                    </p>
                    {used >= limit && (
                        <Link to="/dashboard/teacher/subscription" className="text-[8px] font-black text-emerald-400 underline uppercase tracking-widest animate-pulse">Upgrade</Link>
                    )}
                </div>
            </div>
        </div>

        {/* LOGOUT - Anchored at the bottom */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 mt-16 md:mt-0 w-full overflow-x-hidden">
        
        {/* Internal Content Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="hidden sm:block">
            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-1 italic">Tutor Intelligence</h2>
            <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</span>
                {user?.teacherProfile?.isApproved && <ShieldCheck className="text-emerald-500" size={18} />}
            </div>
          </div>
          
          {/* Top Right Quick Profile */}
          <div className="flex items-center space-x-4 bg-white p-1.5 pr-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="Me" />
                ) : (
                    <span className="text-white font-black text-xs uppercase">{user?.name?.substring(0, 2).toUpperCase()}</span>
                )}
            </div>
            <div className="hidden lg:block">
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">{user?.role}</p>
                <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-1 italic">Verified Professional</p>
            </div>
          </div>
        </header>

        {/* Rendering Sub-pages (Dashboard, Students, Profile, etc.) */}
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-2">
          <Outlet />
        </div>
      </main>

      {/* 4. OVERLAY for mobile drawer */}
      {isSidebarOpen && (
        <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] md:hidden"
        ></div>
      )}
    </div>
  );
};

export default TeacherLayout;