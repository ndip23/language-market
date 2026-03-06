import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, Globe, Zap, ShieldCheck, 
  MessageSquare, Target, TrendingUp, DollarSign, 
  UserCheck, Award, Plus, Minus, HelpCircle 
} from 'lucide-react';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (i) => setActiveFaq(activeFaq === i ? null : i);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION - THE RECRUITMENT HOOK */}
      <section className="pt-32 md:pt-48 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8 italic">
              Get More Students for Your <span className="text-emerald-600 underline decoration-emerald-200">Lessons.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mb-10 leading-relaxed italic">
              We help teachers promote their profiles and connect with students who want to learn. Our promotion system increases your visibility so more students can discover and contact you.
            </p>

            {/* Special Introductory Offer Box */}
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] mb-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-6 py-1.5 font-black text-[9px] uppercase tracking-widest rounded-bl-2xl">Special Offer</div>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Special Introductory Offer</p>
                <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-5xl font-black text-slate-900">$5</span>
                    <span className="text-slate-400 font-bold text-sm">for your first 30 days</span>
                </div>
                <p className="text-slate-500 text-xs font-medium italic">Then $20/month after. No long-term commitment. Cancel anytime.</p>
            </div>

            <Link to="/register" className="inline-flex bg-slate-900 text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all items-center group">
              Start Promotion for $5 <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Luxury Illustration Area */}
          <div className="relative hidden lg:block animate-in zoom-in duration-1000">
             <div className="absolute inset-0 bg-emerald-500/5 rounded-[4rem] blur-3xl"></div>
             <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-12 relative overflow-hidden">
                <TrendingUp size={120} className="text-emerald-100 absolute -bottom-10 -right-10 rotate-12" />
                <div className="relative z-10 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center space-x-6 transform -rotate-2">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex-shrink-0"></div>
                        <div className="h-2 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center space-x-6 translate-x-12">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex-shrink-0"></div>
                        <div className="h-2 w-48 bg-slate-100 rounded-full"></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. HOW WE HELP TEACHERS GET STUDENTS */}
      <section className="py-24 md:py-32 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-6">How We Help Teachers <br/> <span className="text-emerald-600">Get Students</span></h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed italic">Our platform focuses on one goal: helping teachers get discovered by students. When you join, we help promote your teaching profile so students looking for English teachers can find and contact you.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-8"><Target size={28}/></div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic">You Stay Completely Independent</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">You decide how you want to teach, how much you charge, when you want to teach, and how students pay you. Our role is simply to help bring students to you.</p>
          </div>
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl transition-all">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-8"><DollarSign size={28}/></div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic">Keep 100% of Your Earnings</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">When students contact you, you arrange lessons directly with them. You keep 100% of your earnings. We don't take commissions from your private lessons.</p>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INCLUDED IN YOUR MEMBERSHIP */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic text-center mb-20 underline decoration-emerald-200 decoration-8 underline-offset-8">Membership Perks.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { t: "Profile Promotion", c: "Your teaching profile gets promoted to students actively looking for English teachers.", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400" },
                    { t: "Complete Independence", c: "You maintain full control over your teaching methods, pricing, schedule, and student selection.", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400" },
                    { t: "Keep Your Earnings", c: "Keep 100% of what you earn. We don't take commissions from your private external lessons.", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400" }
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl group">
                        <img src={item.img} className="w-full h-56 object-cover group-hover:scale-105 transition-transform" alt=""/>
                        <div className="p-8">
                            <h4 className="text-xl font-black text-slate-900 mb-4 italic uppercase">{item.t}</h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">{item.c}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. EVERYTHING YOU GET (Checklist Section) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-20 rounded-[4rem] shadow-2xl border border-white">
            <h2 className="text-3xl font-black text-slate-900 mb-12 italic underline decoration-emerald-500 decoration-4">Everything You Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    "Promotion of your teaching profile",
                    "Guidance on creating a strong profile",
                    "Basic guidance on teaching online",
                    "Increased visibility to potential students",
                    "Suggestions for teaching materials",
                    "Ongoing support and updates"
                ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                        <span className="text-slate-600 font-bold text-sm uppercase tracking-widest">{text}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. PRICING DETAIL (Intro Offer Focus) */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-16">Teacher Promotion Membership</h2>
            <div className="bg-slate-900 p-10 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-12 py-4 font-black text-xs uppercase tracking-widest rounded-bl-[3rem]">Start Trial</div>
                
                <div className="mb-12">
                    <h3 className="text-6xl font-black text-white italic mb-2">$20<span className="text-lg text-slate-500"> / mo</span></h3>
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mt-8">
                        <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-3">Today's Introductory Offer</p>
                        <div className="flex items-baseline space-x-3 mb-2">
                            <span className="text-6xl font-black text-white italic tracking-tighter">$5</span>
                            <span className="text-slate-400 font-bold text-lg uppercase tracking-widest">First 30 Days</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium italic">Then $20/month after the first month</p>
                    </div>
                </div>

                <ul className="space-y-5 mb-16">
                    {["Profile promotion", "Increased student visibility", "Profile setup guidance", "Teaching resource suggestions", "Ongoing support"].map((item, i) => (
                        <li key={i} className="flex items-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                            <CheckCircle2 size={16} className="text-emerald-500 mr-4" /> {item}
                        </li>
                    ))}
                </ul>

                <Link to="/register" className="w-full block bg-white text-slate-900 text-center py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:bg-emerald-600 hover:text-white transition-all shadow-xl">
                    Start for $5
                </Link>
            </div>
        </div>
      </section>

      {/* 6. TRY FOR $2 SECTION (Psychology of Trial) */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-10">Try the Service for Just <span className="text-emerald-600 underline decoration-emerald-200">$5</span></h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 italic">We understand that many teachers prefer to try a service before committing. Instead of paying the full $20 monthly membership, you can start with just $5 for your first 30 days.</p>
        
        <div className="space-y-6 mb-12">
            {[
                { n: "1", t: "Set up your profile" },
                { n: "2", t: "Experience how the promotion works" },
                { n: "3", t: "Start receiving student interest" }
            ].map((step, i) => (
                <div key={i} className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black italic shadow-lg shrink-0">{step.n}</div>
                    <span className="text-slate-900 font-black uppercase text-sm tracking-widest">{step.t}</span>
                </div>
            ))}
        </div>

        <p className="text-slate-400 font-medium italic">If you like the service, your membership continues at $20/month. If not, you can cancel anytime before renewal. No hidden charges.</p>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 tracking-tighter italic text-center underline decoration-emerald-200 decoration-8 underline-offset-8">Common Questions.</h2>
            <div className="space-y-4">
                {[
                    { q: "Do I need teaching experience?", a: "No. Many teachers start with little or no online teaching experience. Your unique style matters most." },
                    { q: "Who sets the lesson price?", a: "You decide how much you want to charge your students. 100% of that price belongs to you." },
                    { q: "How do I receive payments from students?", a: "You arrange payment directly with your students using the method you prefer (PayPal, Bank, MOMO)." },
                    { q: "Can I cancel my membership?", a: "Yes. You can cancel anytime before your subscription renews. No hidden contracts." }
                ].map((f, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
                        <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between text-left focus:outline-none">
                            <span className="font-black text-slate-900 uppercase text-xs tracking-widest">{f.q}</span>
                            {activeFaq === i ? <Minus className="text-emerald-500"/> : <Plus className="text-slate-300"/>}
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ${activeFaq === i ? 'mt-6 max-h-96' : 'max-h-0'}`}>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">{f.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;