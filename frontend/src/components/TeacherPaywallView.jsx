import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, Zap } from 'lucide-react';

const TeacherPaywallView = ({ title, feature, benefit }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in duration-700">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden">

        {/* Background Accents - Scaled for mobile */}
        <div className="absolute -top-10 -right-10 w-24 h-24 md:w-40 md:h-40 bg-emerald-50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 md:w-40 md:h-40 bg-slate-50 rounded-full blur-3xl -z-10"></div>

        {/* Icon - Scaled for mobile */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner ring-4 md:ring-8 ring-white">
          <Zap size={28} className="fill-emerald-600 md:w-8 md:h-8" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
          <Sparkles size={10} className="mr-2 md:w-3 md:h-3" /> Unlock Professional Growth
        </div>

        {/* Heading - Fluid Typography */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic mb-4 md:mb-6 leading-[1.1]">
          {title} <br />
          <span className="text-emerald-600 underline decoration-emerald-200 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
            {feature}.
          </span>
        </h1>

        {/* Description - Adjusted text size */}
        <p className="text-slate-500 font-medium leading-relaxed mb-8 md:mb-12 text-sm md:text-lg max-w-sm mx-auto">
          {benefit} Join our elite tier to manage your classroom and scale your income.
        </p>

        {/* Button - Fully Responsive */}
        <div className="space-y-6">
          <Link
            to="/dashboard/teacher/subscription"
            className="w-full bg-slate-900 text-white py-4 md:py-6 rounded-xl md:rounded-[1.8rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 group active:scale-95 px-4"
          >
            <span className="truncate">Activate Professional Access</span>
            <ArrowRight size={16} className="ml-2 md:ml-3 group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>

          <div className="text-center mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Review our <Link to="/teacher-guidelines" className="text-emerald-600 underline">Teacher Guidelines</Link> before joining.
            </p>
          </div>
          {/* Trust badges - Stacks on small mobile */}
          <div className="flex flex-col xs:flex-row items-center justify-center space-y-2 xs:space-y-0 xs:space-x-4 md:space-x-8 text-slate-400 font-bold text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-[0.2em]">
            <span className="flex items-center"><ShieldCheck size={12} className="mr-1.5 text-emerald-500" /> Secure Gateway</span>
            <span className="flex items-center underline decoration-emerald-500 underline-offset-2">Instant Deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPaywallView;