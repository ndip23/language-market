import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Globe, Menu, X, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getPortalLink = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin";
    if (user.role === 'teacher') return "/dashboard/teacher";
    return "/dashboard/student";
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 relative z-[110]">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg">
              <Globe size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">LangConnect<span className="text-emerald-500">.</span></span>
          </Link>

          {/* DESKTOP LINKS (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Find Tutors</Link>
            <Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How it works</Link>
            <Link to="/pricing" className="hover:text-emerald-600 transition-colors">Pricing</Link>
            
            {!user ? (
              <>
                <Link to="/login" className="hover:text-emerald-600 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-slate-900 shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                    Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                  <Link to={getPortalLink()} className="flex items-center text-slate-900 hover:text-emerald-600 uppercase">
                      <UserCircle size={20} className="mr-2 text-emerald-600" /> Portal
                  </Link>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer font-black uppercase">Logout</button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden relative z-[110] p-2 bg-slate-50 rounded-xl text-slate-900 active:scale-90 transition-all" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (Exact same links as Desktop) */}
      <div className={`
        fixed inset-0 z-[90] bg-white/95 backdrop-blur-2xl flex flex-col justify-center items-center px-10 space-y-10 transition-all duration-500
        ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
      `}>
        <div className="flex flex-col items-center space-y-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
            <Link to="/" onClick={closeMenu} className="hover:text-emerald-600">Find Tutors</Link>
            <Link to="/how-it-works" onClick={closeMenu} className="hover:text-emerald-600">How it works</Link>
            <Link to="/pricing" onClick={closeMenu} className="hover:text-emerald-600">Pricing</Link>
            
            {!user ? (
                <>
                    <Link to="/login" onClick={closeMenu} className="hover:text-emerald-600">Sign In</Link>
                    <Link to="/register" onClick={closeMenu} className="bg-emerald-600 text-white px-12 py-5 rounded-full shadow-2xl shadow-emerald-500/30">
                        Get Started
                    </Link>
                </>
            ) : (
                <>
                    <Link to={getPortalLink()} onClick={closeMenu} className="text-emerald-600 flex items-center">
                        <UserCircle size={18} className="mr-2"/> Go to Portal
                    </Link>
                    <button onClick={handleLogout} className="text-red-500">Sign Out</button>
                </>
            )}
        </div>
      </div>
    </>
  );
};

export default Navbar;