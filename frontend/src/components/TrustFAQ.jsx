import { HelpCircle, ChevronRight } from 'lucide-react';

const TrustFAQ = () => {
  const faqs = [
    { q: "Do I need teaching experience?", a: "No. Many of our most successful tutors start with little to no online experience. We value your language passion above all." },
    { q: "Who sets the lesson price?", a: "You have 100% control. You decide exactly how much your time is worth per hour." },
    { q: "How do I receive payments?", a: "You arrange payments directly with your students using your preferred methods (PayPal, Bank, or Mobile Money)." },
    { q: "Can I cancel my membership?", a: "Absolutely. You are never locked into a contract. Cancel your subscription anytime before it renews." }
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-slate-900 mb-12 italic tracking-tighter text-center md:text-left underline decoration-emerald-200 decoration-8 underline-offset-8">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center space-x-4 mb-3">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><HelpCircle size={16}/></div>
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{f.q}</h4>
            </div>
            <p className="text-slate-500 font-medium text-sm leading-relaxed italic ml-10">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustFAQ;