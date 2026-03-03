import { ShieldCheck, FileText, Scale } from 'lucide-react';

const TermsOfService = () => {
    const sections = [
        {
            title: "1. The Marketplace Platform",
            content: "LangConnect provides a digital bridge connecting independent language tutors with students. We do not employ tutors; they are independent contractors who set their own rates and curriculums."
        },
        {
            title: "2. Payment & Commissions",
            content: "Payments processed through our secure gateway are subject to a 15% platform commission. Tutors are responsible for any local taxes associated with their earnings."
        },
        {
            title: "3. Subscription Tiers",
            content: "Tutors agree to the monthly subscription limits ($5 for 6 connections, $10 for 20 connections). Student limits reset every 30 days upon successful payment renewal."
        },
        {
            title: "4. User Conduct",
            content: "Users agree to maintain a professional environment. Harassment, external payment solicitation (bypassing the platform), or fraudulent activity will result in immediate account suspension."
        },
        {
            title: "5. Teacher Specific Rules",
            content: "Tutors agree to the Earnings Policy (100% ownership unless internal processing is chosen), Professional Conduct standards, and the No Poaching Policy. Violation of conduct or poaching rules results in immediate, permanent account termination."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-40 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <Scale size={14} className="mr-2" /> Legal Agreement
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic">Terms of <span className="text-emerald-600">Service.</span></h1>
                    <p className="text-slate-400 font-bold mt-6 uppercase text-xs tracking-widest">Last Updated: March 2024</p>
                </div>

                <div className="space-y-12">
                    {sections.map((s, i) => (
                        <div key={i} className="border-b border-slate-50 pb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-4 italic uppercase tracking-tight">{s.title}</h2>
                            <p className="text-slate-500 font-medium leading-loose text-lg">{s.content}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] text-center border border-slate-100">
                    <ShieldCheck size={40} className="text-emerald-600 mx-auto mb-6" />
                    <p className="text-slate-900 font-black italic text-xl">Protecting our global community.</p>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Questions? Email legal@learnlanguagehelp.site</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;