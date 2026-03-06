import { Megaphone, Users, MessageSquare, Target } from 'lucide-react';

const TeacherDiscovery = () => {
  const steps = [
    {
      icon: <Target className="text-emerald-600" />,
      title: "Strategic Promotion",
      desc: "Once you activate a plan, our algorithms begin promoting your profile across our premium student channels."
    },
    {
      icon: <Users className="text-emerald-600" />,
      title: "Student Discovery",
      desc: "Students looking for English or French experts view your elite profile, bio, and rates in their search results."
    },
    {
      icon: <MessageSquare className="text-emerald-600" />,
      title: "Direct Connection",
      desc: "Interested students contact you directly through our secure portal to discuss goals and arrange lessons."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 rounded-[4rem] my-20 px-6 border border-slate-100 shadow-inner">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">How Students <span className="text-emerald-600">Find You.</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Automated Visibility & Marketing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-slate-50">
                {s.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 italic tracking-tight">{s.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto italic">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center max-w-2xl mx-auto shadow-sm">
            <p className="text-slate-900 font-black text-sm italic">"Our goal is simple: increase your visibility so you can focus on teaching while we handle the discovery."</p>
        </div>
      </div>
    </section>
  );
};

export default TeacherDiscovery;