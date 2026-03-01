import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Globe, UserCircle, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center transition-all">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
          <Globe size={20} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-900">LangConnect<span className="text-emerald-500">.</span></span>
      </Link>

      {/* Center Links - Hidden on Mobile */}
      <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Find Tutors</Link>
        <Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How it works</Link>
        <Link to="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link>
      </div>

      <div className="flex items-center space-x-6">
        {!user ? (
          <>
            <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600">Sign In</Link>
            <Link to="/register" className="bg-emerald-600 text-white px-7 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard/student'} className="flex items-center text-slate-900 font-black text-[11px] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <UserCircle size={18} className="mr-2" /> Portal
            </Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 font-black text-[11px] uppercase tracking-widest">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;