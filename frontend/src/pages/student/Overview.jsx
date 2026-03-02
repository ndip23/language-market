import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe } from 'lucide-react';

const StudentOverview = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-10">
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 border border-slate-100 shadow-2xl text-center relative overflow-hidden">
        
        {/* Design accents - Hidden on small mobile to save space */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-emerald-50 rounded-bl-full -z-10"></div>

        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-inner ring-4 md:ring-8 ring-white">
          <Globe size={28} className="md:w-9 md:h-9" />
        </div>

        <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
          <Sparkles size={12} className="mr-2" /> Your Fluency Awaits
        </div>

        <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-4 md:mb-6 leading-tight">
          Ready to become <br className="hidden md:block"/> <span className="text-emerald-600 underline decoration-emerald-200 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Fluent?</span>
        </h1>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-10 md:mb-12 text-sm md:text-lg max-w-md mx-auto px-2">
          Welcome, {user?.name.split(' ')[0]}. You haven't booked any lessons yet. Start your 1-on-1 immersive journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
          <Link 
            to="/dashboard/student/find" 
            className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl group"
          >
            Find a Tutor <ArrowRight size={16} className="ml-2 md:ml-3 group-hover:translate-x-1" />
          </Link>
          
          <Link to="/dashboard/student/how-it-works" className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors py-2">
            How it works
          </Link>
        </div>

        {/* Responsive Stats */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-slate-50 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
                <p className="text-xl md:text-2xl font-black text-slate-900">500+</p>
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Elite Tutors</p>
            </div>
            <div>
                <p className="text-xl md:text-2xl font-black text-slate-900">100%</p>
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Secure</p>
            </div>
            <div className="col-span-2 md:col-span-1">
                <p className="text-xl md:text-2xl font-black text-slate-900">24/7</p>
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Support</p>
            </div>
        </div>
      </div>
    </div>
  );
};
export default StudentOverview;