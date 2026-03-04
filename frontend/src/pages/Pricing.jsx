import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 italic">Transparent <span className="text-emerald-600">Pricing.</span></h1>
        <p className="text-xl text-slate-500 font-medium">No hidden fees. No complicated contracts. Just results.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Card: Basic */}
        <div className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col h-full hover:-translate-y-2 transition-transform">
          <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-6 block bg-emerald-50 w-fit px-4 py-1 rounded-full">Tutor Basic</span>
          <div className="text-7xl font-black text-slate-900 mb-8">$0.5<span className="text-sm font-bold text-slate-300">/mo</span></div>
          
          <ul className="space-y-6 mb-12 flex-1">
            {[
              "Marketplace Visibility",
              "6 Student Connections per month",
              "External Payment Support",
              "Personalized Profile Gallery",
              "Student Messaging System"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-slate-600 font-medium">
                <Check size={18} className="text-emerald-500 mr-4" /> {item}
              </li>
            ))}
          </ul>
          
          <Link to="/register" className="w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">Get Started</Link>
        </div>

        {/* Right Card: Pro */}
        <div className="bg-slate-900 p-12 md:p-16 rounded-[3.5rem] shadow-2xl flex flex-col h-full relative overflow-hidden transform lg:scale-105">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white px-10 py-3 font-black text-[10px] tracking-[0.2em] rounded-bl-[2rem] animate-pulse">MOST POPULAR</div>
          <span className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 block bg-white/5 w-fit px-4 py-1 rounded-full border border-white/10">Tutor Pro</span>
          <div className="text-7xl font-black text-white mb-8">$10<span className="text-sm font-bold text-slate-600">/mo</span></div>
          
          <ul className="space-y-6 mb-12 flex-1">
            {[
              "Everything in Basic",
              "20 Student Connections per month",
              "Featured Priority in Search",
              "Verified Badge on Profile",
              "Detailed Performance Analytics",
              "15% Low-Fee Payment Processing"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-slate-300 font-medium">
                <Check size={18} className="text-emerald-400 mr-4" /> {item}
              </li>
            ))}
          </ul>
          
          <Link to="/register" className="w-full bg-emerald-600 text-white text-center py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-500/30 transition-all">Upgrade Now</Link>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-4xl mx-auto mt-20 p-8 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between shadow-sm">
         <div className="flex items-center mb-6 md:mb-0">
            <Info size={24} className="text-emerald-600 mr-4 shrink-0" />
            <p className="text-slate-500 font-medium text-sm">Students browse and contact for <span className="text-slate-900 font-black italic">Free.</span> Only pay the lesson fee set by the tutor.</p>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Commission</p>
            <p className="text-2xl font-black text-slate-900">15.0%</p>
         </div>
      </div>
    </div>
  );
};

export default Pricing;