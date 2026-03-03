import { ShieldCheck, DollarSign, Zap, UserCheck, Scale, Award, AlertTriangle, Coins } from 'lucide-react';

const TeacherGuidelines = () => {
  const rules = [
    {
      icon: <DollarSign className="text-emerald-600" />,
      title: "1. Earnings Policy",
      content: "100% of the money you earn belongs to you. You are free to set your own price, choose your own schedule, and decide how you receive your payments (PayPal, Mobile Money, Bank Transfer, etc). We do not interfere with your pricing or methods."
    },
    {
      icon: <Zap className="text-emerald-600" />,
      title: "2. Package-Based Allocation",
      content: "Visibility and student matching priority are determined by your purchased package. While higher tiers receive significantly higher exposure, packages increase visibility and do not guarantee a fixed number of students."
    },
    {
      icon: <Coins className="text-emerald-600" />,
      title: "3. Optional Internal Payments",
      content: "If you choose our internal system, we handle processing and quality control for a 15% commission per transaction. This provides additional structure and payment security."
    },
    {
      icon: <ShieldCheck className="text-emerald-600" />,
      title: "4. Independent Payment Option",
      content: "Teachers preferring external management keep 100% of their earnings. Our responsibility remains providing student visibility and matching based on your package."
    },
    {
      icon: <UserCheck className="text-emerald-600" />,
      title: "5. Approval Process",
      content: "Profiles are reviewed within 24–48 hours after signup and package purchase. This ensures platform quality and professional standards for our students."
    },
    {
      icon: <Award className="text-emerald-600" />,
      title: "6. Professional Conduct",
      content: "Tutors must be punctual, deliver the full agreed duration, and maintain respectful communication. Failure to comply may result in account suspension."
    },
    {
      icon: <AlertTriangle className="text-emerald-600" />,
      title: "7. No Student Poaching",
      content: "Redirecting students outside the platform to bypass policies or misrepresenting services is strictly prohibited and results in permanent suspension."
    },
    {
      icon: <Scale className="text-emerald-600" />,
      title: "8. Refund Policy",
      content: "Teacher packages are non-refundable after profile approval. Packages provide increased exposure and matching priority only."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck size={14} className="mr-2" /> Official Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic mb-6">Teacher <span className="text-emerald-600 underline decoration-emerald-200">Guidelines.</span></h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">The standards for elite educators on the LangConnect platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {rules.map((rule, i) => (
            <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {rule.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{rule.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed italic">{rule.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherGuidelines;