import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, Globe, Zap, ShieldCheck, 
  MessageSquare, Target, TrendingUp, DollarSign, 
  UserCheck, Award, Plus, Minus, HelpCircle, Check, 
  Crown, CircleOff, Banknote, Users, BookOpen
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Replica of Screenshots 1 & 2) */}
      <section className="pt-32 md:pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8 italic">
              Teach Online <br /> 
              <span className="text-emerald-600 underline decoration-emerald-200">Without the Barriers</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mb-10 leading-relaxed italic">
              No certificates required. No endless applications. No complicated approval processes. Just you, your students, and 100% of your earnings.
            </p>

            <div className="space-y-4 mb-10">
                {[
                    "Keep 100% of what students pay you",
                    "Profile live in 24-48 hours",
                    "Students discover and book you directly"
                ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <div className="bg-emerald-100 text-emerald-600 rounded-full p-1"><Check size={14} strokeWidth={4} /></div>
                        <span className="text-slate-700 font-bold text-sm uppercase tracking-widest">{text}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all text-center active:scale-95">
                  Get My Profile — $5 First Month
                </Link>
                <button className="bg-white text-slate-900 border border-slate-200 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-center">
                  Learn More
                </button>
            </div>
          </div>

          <div className="relative animate-in zoom-in duration-1000">
             {/* Replace with your watercolor illustration */}
             <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200" 
                    alt="Diverse Teachers" 
                    className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 2. WHY TEACHERS CHOOSE US (Replica of Screenshot 3) */}
      <section className="py-24 bg-white px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-4">Why Teachers Choose Us</h2>
                <p className="text-slate-500 font-medium italic">We understand the frustration. Traditional platforms have too many barriers. We're different.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <CircleOff size={32} />, t: "No Certificate Requirements", c: "Rejected because you don't have TOEFL, IELTS or CELTA? Not here. We believe in your ability to teach." },
                    { icon: <Zap size={32} />, t: "Fast Approval", c: "Your profile is live and visible within 24-48 hours. Start getting bookings in days, not months." },
                    { icon: <Banknote size={32} />, t: "Keep 100% of Earnings", c: "No hidden fees. No commission cuts. Every dollar your students pay goes directly to you." }
                ].map((item, i) => (
                    <div key={i} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:border-emerald-500 transition-all group">
                        <div className="text-emerald-600 mb-6 bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">{item.icon}</div>
                        <h4 className="text-xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">{item.t}</h4>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed italic">{item.c}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Replica of Screenshot 4) */}
      <section className="py-24 px-6 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-16">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
                {[
                    { n: "1", t: "Pay $5", c: "Start your first month for just $5" },
                    { n: "2", t: "We Create Your Profile", c: "Professional profile setup and advertising" },
                    { n: "3", t: "Get Students", c: "Students discover and book you directly" }
                ].map((step, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative z-10">
                        <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-black italic shadow-xl mb-6">{step.n}</div>
                        <h4 className="text-xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter">{step.t}</h4>
                        <p className="text-slate-500 font-medium text-xs italic">{step.c}</p>
                    </div>
                ))}
                {/* Visual Connector Line for Desktop */}
                <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
            </div>
        </div>
      </section>

      {/* 4. WHAT'S INCLUDED (Replica of Screenshot 5) */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto bg-white border border-emerald-100 rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Crown size={120} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-10 italic uppercase tracking-tighter">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                    { t: "Professional Booking Profile", c: "Students can view and book lessons directly" },
                    { t: "Profile Advertising & Visibility", c: "Your profile is promoted to find students" },
                    { t: "Teaching Resources", c: "Materials and tools to teach effectively" },
                    { t: "Mentorship Community", c: "Access a community of teachers sharing tips" }
                ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                        <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 mt-1 shrink-0"><Check size={14} strokeWidth={4} /></div>
                        <div>
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">{item.t}</h4>
                            <p className="text-slate-400 font-bold text-xs italic mt-1">{item.c}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 5. YOUR BENEFITS (Replica of Screenshot 6) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-4">Your Benefits</h2>
                <p className="text-slate-500 font-medium italic">Everything you need to succeed as an independent online teacher.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { t: "Complete Freedom", c: "Set your own schedule, rates, and teaching style. You're in control.", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400" },
                    { t: "Supportive Community", c: "Connect with other teachers, share experiences, and learn.", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400" },
                    { t: "Unlimited Growth", c: "Build your student base and increase your income without limits.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400" }
                ].map((item, i) => (
                    <div key={i} className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl flex flex-col h-full bg-slate-50">
                        <img src={item.img} className="w-full h-56 object-cover" />
                        <div className="p-10 text-center">
                            <h4 className="text-2xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">{item.t}</h4>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">{item.c}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. PRICING (Replica of Screenshots 7 & 8) */}
<section className="py-24 md:py-32 px-6 bg-[#FAF9F6]">
  <div className="max-w-4xl mx-auto">
    
    {/* Heading */}
    <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-4">Elite Membership.</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Scale your teaching career today</p>
    </div>

    {/* THE CARD */}
    <div className="max-w-xl mx-auto bg-white rounded-[4.5rem] p-10 md:p-16 border border-slate-100 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden text-center group">
      
      {/* Fancy Top Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-2.5 rounded-b-[1.5rem] font-black text-[9px] uppercase tracking-[0.3em] shadow-lg">
        Official Enrollment
      </div>

      {/* 1. Trial Spotlight Section */}
      <div className="mt-8 mb-12 p-8 md:p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={60} className="text-emerald-600" />
        </div>
        
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3 italic">
          Introductory Trial Offer
        </p>
        
        <div className="flex items-baseline justify-center space-x-2">
          <span className="text-7xl md:text-8xl font-black text-slate-900 italic tracking-tighter leading-none">
            $5
          </span>
          <div className="text-left">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-none">First</p>
            <p className="text-slate-900 font-black text-lg uppercase tracking-tighter leading-none">30 Days</p>
          </div>
        </div>
      </div>

      {/* 2. Secondary Price Info */}
      <div className="mb-14 px-8">
         <div className="w-full h-px bg-slate-100 mb-8 flex items-center justify-center">
            <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Ongoing Access</span>
         </div>
         <div className="flex items-center justify-center space-x-3">
            <span className="text-4xl font-black text-slate-900 italic">$50</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ Month Onward</span>
         </div>
      </div>

      {/* 3. High-Value Features */}
      <div className="space-y-6 mb-16 text-left max-w-sm mx-auto">
        {[
          { t: "Professional Booking Profile", c: "Premium listing with student booking" },
          { t: "Full Profile Visibility", c: "Priority promotion in marketplace" },
          { t: "Teaching Materials", c: "Curated resources & lesson guides" },
          { t: "Elite Community Access", c: "Join our private mentor circle" },
          { t: "100% Earnings Retention", c: "Keep every dollar students pay you" }
        ].map((item, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="bg-emerald-600 text-white p-1 rounded-full shrink-0 shadow-lg shadow-emerald-500/20">
              <Check size={14} strokeWidth={4} />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-widest leading-none mb-1.5">{item.t}</h4>
              <p className="text-slate-400 font-medium text-[9px] uppercase tracking-widest italic">{item.c}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Action Area */}
      <Link to="/register" className="w-full inline-flex bg-emerald-600 text-white py-6 md:py-7 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 transition-all items-center justify-center group active:scale-95 cursor-pointer">
        Start Teaching Today <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
      </Link>

      <p className="text-slate-400 font-black text-[8px] uppercase tracking-widest mt-8 italic px-4 leading-relaxed">
        Your professional profile will typically be live and visible within 48 hours.
      </p>

    </div>
  </div>
</section>

      {/* 7. FINAL CTA (Replica of Screenshot 9 & 10) */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter italic mb-6 leading-tight">Ready to Start Teaching Online?</h2>
            <p className="text-slate-500 font-medium text-lg md:text-xl mb-12 italic max-w-2xl mx-auto">
                Stop waiting for approval. Stop paying high commissions. Start teaching on your own terms today.
            </p>
            <Link to="/register" className="inline-flex bg-emerald-600 text-white px-10 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all items-center group active:scale-95">
              Claim My Profile — $5 First Month <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;