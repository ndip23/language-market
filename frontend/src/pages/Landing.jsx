import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Megaphone, Users, MessageSquare, 
  Target, HelpCircle, Check, ShieldCheck, Globe, Zap 
} from 'lucide-react';
import TeacherDiscovery from '../components/TeacherDiscovery';
import TrustFAQ from '../components/TrustFAQ';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="pt-40 md:pt-56 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-100 italic">
            <Sparkles size={14} className="mr-2 animate-pulse" /> Language Learning Reimagined
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8 italic">
            Your bridge to <br/> <span className="text-emerald-600 underline decoration-emerald-200 decoration-8 underline-offset-8">Fluency.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed italic">
            Connect with elite English and French tutors for personalized 1-on-1 sessions. Designed for those who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/explore" 
              className="w-full sm:w-auto bg-slate-900 text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center group"
            >
              Get Started <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/how-it-works" className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-colors">Learn more</Link>
          </div>
        </div>
      </section>

      {/* 2. SECTION – HOW STUDENTS FIND YOU (Requirement #1) */}
      <section className="py-32 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block italic">For Educators</span>
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 italic">How Students <br/> Discover You.</h2>
               <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-xl"><Target size={24}/></div>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed">Once you join and set up your teaching profile, we begin promoting it to students who are looking for English teachers.</p>
                  </div>
                  <ul className="space-y-4 ml-14">
                    {["Discover your profile through our promotion channels", "View your teaching information", "Contact you directly if they are interested"].map((li, i) => (
                        <li key={i} className="flex items-center text-slate-500 font-bold text-sm italic">
                            <Check size={16} className="text-emerald-500 mr-3" /> {li}
                        </li>
                    ))}
                  </ul>
                  <p className="text-slate-900 font-black italic text-lg ml-14 leading-relaxed">"Our goal is simple: increase your visibility so more students can discover you."</p>
               </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000" 
                    className="relative z-10 rounded-[4rem] shadow-2xl border-8 border-white"
                    alt="Students Learning"
                />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC PRICING SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic">Transparent Tiers.</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-4">No hidden fees. Full control.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* ... Use your existing Pricing cards here ... */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col">
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6">Tutor Basic</span>
                <div className="text-6xl font-black text-slate-900 mb-8">$5<span className="text-sm font-bold text-slate-200">/mo</span></div>
                <p className="text-slate-500 font-medium italic mb-10">Start with 6 high-quality student connections per month.</p>
                <Link to="/register" className="w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-600 transition-all uppercase">Get Started</Link>
            </div>
            <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 font-black text-[8px] tracking-widest rounded-bl-2xl">POPULAR</div>
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-6">Tutor Pro</span>
                <div className="text-6xl font-black text-white mb-8">$10<span className="text-sm font-bold text-slate-600">/mo</span></div>
                <p className="text-slate-400 font-medium italic mb-10">Maximize visibility with 20 student connections per month.</p>
                <Link to="/register" className="w-full bg-emerald-600 text-white text-center py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-500 transition-all uppercase">Select Pro</Link>
            </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (Requirement #2) */}
      <section className="py-32 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 tracking-tighter italic text-center underline decoration-emerald-200 decoration-8 underline-offset-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
                {[
                    { q: "Do I need teaching experience?", a: "No. Many teachers start with little or no online teaching experience." },
                    { q: "Who sets the lesson price?", a: "You decide how much you want to charge your students. 100% of that price belongs to you." },
                    { q: "How do I receive payments from students?", a: "You arrange payment directly with your students using the method you prefer." },
                    { q: "Can I cancel my membership?", a: "Yes. You can cancel anytime before your subscription renews." }
                ].map((f, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><HelpCircle size={18}/></div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">{f.q}</h4>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed italic">{f.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="py-40 px-6 bg-white text-center">
        <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-12">Ready to grow?</h2>
        <Link to="/register" className="inline-block bg-emerald-600 text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all">
          Create Tutor Account
        </Link>
      </section>
    </div>
  );
};

export default Landing;