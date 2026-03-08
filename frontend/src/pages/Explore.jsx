import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Star, ArrowUpRight, Zap, 
  ShieldCheck, Video, Heart, Sparkles, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';
import TeacherDiscovery from '../components/TeacherDiscovery';
import TrustFAQ from '../components/TrustFAQ';

const Explore = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ language: '', maxPrice: '' });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/teachers?language=${filters.language}&maxPrice=${filters.maxPrice}`);
      setTeachers(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Could not load tutors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [filters]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* 1. LUXURY HERO SECTION */}
      <section className="pt-32 md:pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center bg-white border border-emerald-100 px-4 py-2 rounded-full text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles size={14} className="mr-2 animate-pulse" /> The elite standard in language learning
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1] md:leading-[0.9]">
            Master languages <br className="hidden md:block"/> with <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-8">elite</span> tutors.
          </h1>
          
          <p className="text-sm md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed px-4 italic">
            Connect with certified English and French professionals. Experience high-end 1-on-1 sessions designed for rapid fluency.
          </p>

          {/* 🚨 MOBILE-ONLY "GET STARTED" CTA */}
          <div className="md:hidden px-4 mb-12">
              <Link to="/register" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center shadow-2xl transition-all active:scale-95 group">
                  Get Started Now <ArrowRight size={16} className="ml-3 group-hover:translate-x-1" />
              </Link>
          </div>
          
          {/* Professional Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white border border-slate-100 p-2 md:p-3 rounded-[2rem] md:rounded-full shadow-2xl max-w-3xl mx-auto space-y-2 md:space-y-0 transition-all hover:border-emerald-200">
            <select 
              className="w-full md:w-1/3 bg-transparent px-8 py-3 md:py-4 outline-none font-black text-slate-900 outline-none text-xs uppercase cursor-pointer"
              onChange={(e) => setFilters({...filters, language: e.target.value})}
            >
              <option value="">Any Language</option>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
            <input 
              type="number" 
              placeholder="Max price ($)" 
              className="w-full md:w-1/3 bg-transparent px-8 py-3 md:py-4 outline-none font-bold text-slate-900 placeholder-slate-300 text-xs md:text-base"
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
            <button 
              onClick={fetchTeachers}
              className="w-full md:w-1/3 bg-slate-900 text-white font-black py-5 md:py-5 rounded-[1.5rem] md:rounded-full hover:bg-emerald-600 shadow-xl flex justify-center items-center uppercase tracking-widest text-[9px] md:text-[10px] transition-all active:scale-95"
            >
              <Search size={16} className="mr-2" /> Find Tutors
            </button>
          </div>
        </div>
      </section>

      {/* TUTOR GRID */}
      <div className=" mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Available <span className="text-emerald-600">Tutors</span></h2>
        </div>
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? <Loader /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-in fade-in duration-700">
              {teachers.map(t => (
                <div key={t._id} className="bg-white border border-slate-100 rounded-[3rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
                   <div className="relative overflow-hidden rounded-[2.5rem] mb-6">
                      <img src={t.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'} className="w-full h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute bottom-6 left-6 bg-white/95 px-5 py-2 rounded-2xl font-black text-emerald-600 shadow-xl">${t.teacherProfile.pricePerLesson}/lesson</div>
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 mb-2">{t.name}</h3>
                   <p className="text-emerald-600 font-black uppercase tracking-widest text-[9px] mb-8 italic">{t.teacherProfile.language} Specialist</p>
                   <Link to={`/teacher/${t._id}`} className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-emerald-600 transition-all flex justify-center items-center shadow-lg uppercase tracking-widest text-[10px]">
                      View Profile <ArrowUpRight size={18} className="ml-2" />
                   </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <TeacherDiscovery />
        <TrustFAQ />
    </div>
  );
};

export default Explore;