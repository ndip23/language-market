import { Search, Calendar, Video, ShieldCheck, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentHowItWorks = () => {
  const steps = [
    { 
      icon: <Search className="text-emerald-600" size={32} />, 
      title: "Find Your Tutor", 
      desc: "Use our internal search to browse verified English and French tutors. Filter by rate and rating to find your perfect match." 
    },
    { 
      icon: <Calendar className="text-emerald-600" size={32} />, 
      title: "Secure a Session", 
      desc: "Click 'Book Lesson' on a tutor's profile. Your request is sent instantly. Once they accept, you'll be notified to complete payment." 
    },
    { 
      icon: <Video className="text-emerald-600" size={32} />, 
      title: "Enter the Classroom", 
      desc: "On the day of your lesson, simply go to your 'Lessons' tab and click 'Join Room'. Our HD classroom is secure and private." 
    }
  ];

  return (
    <div className="max-w-5xl animate-in fade-in duration-700 pb-20">
      <div className="mb-16">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2">Student Guide</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Mastering the LangConnect Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {steps.map((step, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="bg-emerald-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight italic">{step.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Pro-Tips Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="max-w-md">
                <h4 className="text-2xl font-black italic mb-2 text-emerald-400">Pro Tip: Use the Heart</h4>
                <p className="text-slate-400 text-sm font-medium">Bookmark your favorite tutors by tapping the heart icon on their profile. This adds them to your 'Saved' tab for instant access.</p>
            </div>
            <Link to="/dashboard/student/find" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Start Browsing
            </Link>
         </div>
      </div>
    </div>
  );
};

export default StudentHowItWorks;