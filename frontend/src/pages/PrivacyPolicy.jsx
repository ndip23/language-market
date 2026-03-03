import { Lock, Eye, Globe, User, ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  const points = [
    { 
      icon: <User size={24}/>, 
      title: "Identity Data", 
      desc: "We securely store your name, email, and mobile number to verify your professional identity and process secure payouts." 
    },
    { 
      icon: <Lock size={24}/>, 
      title: "Bank-Grade Security", 
      desc: "Your financial details never touch our servers. All transactions are encrypted and processed by Swychr (AccountPe)." 
    },
    { 
      icon: <Globe size={24}/>, 
      title: "Global Storage", 
      desc: "Images and classroom assets are hosted on Cloudinary's encrypted global CDN for maximum speed and data privacy." 
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20 px-6 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20 md:mb-32">
          <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck size={14} className="mr-2" /> Data Protocol v1.0
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-none">
            Privacy <br/> <span className="text-emerald-600">Protocols.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium mt-8 max-w-xl mx-auto">
            How we manage and protect the elite data of our global community.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32">
          {points.map((p, i) => (
            <div key={i} className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform">{p.icon}</div>
                <h3 className="text-base md:text-lg font-black text-slate-900 mb-3 uppercase tracking-tighter italic">{p.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Text */}
        <div className="space-y-12 text-slate-600 font-medium leading-loose text-base md:text-lg italic">
            <section>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tight uppercase mb-4 underline decoration-emerald-200 decoration-8 underline-offset-8">Cookie Usage</h2>
                <p>We use high-performance session cookies to keep your dashboard active. These are deleted once you log out. We do not use tracking cookies for third-party advertising. Your learning journey is your business alone.</p>
            </section>
            
            <section>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tight uppercase mb-4 underline decoration-emerald-200 decoration-8 underline-offset-8">Account Termination</h2>
                <p>You have the right to request full data deletion at any time. Once requested, your profile, messages, and earnings history will be scrubbed from our cloud servers within 48 hours.</p>
            </section>
        </div>

        <div className="mt-24 p-10 bg-slate-900 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full"></div>
            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">Privacy Officer</p>
            <p className="text-white text-xl font-bold italic">legal@learnlanguagehelp.site</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;