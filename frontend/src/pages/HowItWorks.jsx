import { Search, Calendar, Video, Star, CheckCircle2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 italic">Simple. Seamless. <br/><span className="text-emerald-600">Effective.</span></h1>
        <p className="text-xl text-slate-500 font-medium">Whether you're here to learn or to teach, we've built the world's most intuitive language bridge.</p>
      </div>

      {/* For Students Section */}
      <section className="max-w-6xl mx-auto mb-32">
        <div className="flex items-center space-x-4 mb-12">
            <span className="bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">For Students</span>
            <div className="h-px bg-slate-100 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Search size={40}/>, title: "1. Discover", desc: "Browse our elite list of English and French tutors. Filter by price, rating, and availability." },
            { icon: <Calendar size={40}/>, title: "2. Book", desc: "Schedule a 1-on-1 session that fits your life. No long-term commitments, just pay as you go." },
            { icon: <Video size={40}/>, title: "3. Learn", desc: "Enter our premium digital classroom and start speaking. High-quality video and tools built for fluency." }
          ].map((step, i) => (
            <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="max-w-6xl mx-auto mb-32">
        <div className="flex items-center space-x-4 mb-12">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">For Teachers</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Star size={40}/>, title: "1. Apply", desc: "Sign up and create your elite profile. Once approved by our team, you're live on the marketplace." },
            { icon: <CheckCircle2 size={40}/>, title: "2. Connect", desc: "Choose a subscription tier that fits your goals and start receiving high-quality student connections." },
            { icon: <DollarSign size={40}/>, title: "3. Earn", desc: "Set your own rates and get paid. Use our platform for 100% secure payments or manage your own." }
          ].map((step, i) => (
            <div key={i} className="p-10 bg-white border border-slate-200 rounded-[3rem] hover:border-emerald-500 transition-all group">
              <div className="text-emerald-600 mb-6 group-hover:scale-110 transition-transform">{step.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
         <Link to="/register" className="bg-emerald-600 text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 transition-all">Start Your Journey</Link>
      </div>
    </div>
  );
};

export default HowItWorks;