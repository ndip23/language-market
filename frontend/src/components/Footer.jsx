import { Link } from 'react-router-dom';
import { Globe, Instagram, Twitter, Linkedin, Facebook, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
              <Globe size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">LangConnect<span className="text-emerald-500">.</span></span>
          </Link>
          <p className="text-slate-500 font-medium leading-relaxed italic">
            Connecting the world's most elite language professionals with students who demand results.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"><Instagram size={20}/></a>
            <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"><Twitter size={20}/></a>
            <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"><Linkedin size={20}/></a>
          </div>
        </div>

        {/* Column 2: Marketplace */}
        <div>
          <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Marketplace</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Find a Tutor</Link></li>
            <li><Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How it works</Link></li>
            <li><Link to="/pricing" className="hover:text-emerald-600 transition-colors">Tutor Pricing</Link></li>
            <li><Link to="/register" className="hover:text-emerald-600 transition-colors">Join as Teacher</Link></li>
          </ul>
        </div>

        {/* Column 3: Support & Trust */}
        <div>
          <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Support</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Safety Guide</Link></li>
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter / Contact */}
        <div>
          <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Contact Us</h4>
          <div className="space-y-4">
            <div className="flex items-center text-slate-500 text-sm font-bold italic">
               <Mail size={16} className="text-emerald-600 mr-3" /> hello@langconnect.com
            </div>
            <div className="flex items-center text-slate-500 text-sm font-bold italic">
               <Phone size={16} className="text-emerald-600 mr-3" /> +1 (800) 555-LANG
            </div>
            <div className="pt-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Certified Language Platform</p>
               <div className="h-10 w-32 bg-slate-100 rounded-lg flex items-center justify-center grayscale opacity-50">
                  {/* Placeholder for a trust badge like Stripe or an Educational Org */}
                  <span className="text-[10px] font-black italic">TRUSTED SYSTEM</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-slate-50 pt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} LangConnect Marketplace. All Rights Reserved.
        </p>
        <div className="flex space-x-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
           <span>English</span>
           <span>French</span>
           <span className="text-emerald-600 italic">24/7 Monitoring Active</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;