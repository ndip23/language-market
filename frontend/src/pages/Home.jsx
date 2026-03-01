import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Star, ArrowUpRight, Zap, 
  ShieldCheck, Video, Heart, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';

const Home = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ language: '', maxPrice: '' });

  // Fetch teachers from backend based on filters
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/teachers?language=${filters.language}&maxPrice=${filters.maxPrice}`);
      setTeachers(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Could not load tutors. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [filters]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. LUXURY HERO SECTION */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center bg-white border border-emerald-100 px-4 py-2 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8 shadow-sm">
            <Sparkles size={14} className="mr-2 animate-pulse" /> The elite standard in language learning
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            Master languages <br/> with <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-8">elite</span> tutors.
          </h1>
          
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
            Connect with certified English and French professionals. 
            Experience high-end 1-on-1 sessions designed for rapid fluency.
          </p>
          
          {/* Professional Search Bar */}
          <div className="flex flex-col md:flex-row items-center bg-white border border-slate-100 p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-3xl mx-auto">
            <select 
              className="w-full md:w-1/3 bg-transparent px-8 py-4 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
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
              className="w-full md:w-1/3 bg-transparent px-8 py-4 outline-none font-bold text-slate-900 placeholder-slate-300"
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
            <button 
              onClick={fetchTeachers}
              className="w-full md:w-1/3 bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-emerald-600 shadow-xl flex justify-center items-center uppercase tracking-widest text-[10px] transition-all active:scale-95"
            >
              <Search size={16} className="mr-2" /> Find Tutors
            </button>
          </div>
        </div>
      </section>

      {/* 2. TRUST & STATS BANNER */}
      <section className="bg-slate-900 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Verified Tutors', val: '500+' },
            { label: 'Happy Students', val: '12k+' },
            { label: 'Success Rate', val: '99%' },
            { label: 'Avg Rating', val: '4.9/5' },
          ].map((stat, i) => (
            <div key={i} className="group">
              <div className="text-white text-4xl font-black mb-1 group-hover:text-emerald-400 transition-colors">{stat.val}</div>
              <div className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. "WHY US" - FEATURE SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">World-Class Standards.</h2>
          <p className="text-slate-400 font-bold mt-4 uppercase text-xs tracking-[0.4em] italic">Redefining the marketplace experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <Zap size={44} className="text-emerald-600 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Instant Matching</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Browse our elite roster and connect with your perfect tutor in under 60 seconds.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <ShieldCheck size={44} className="text-emerald-600 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Verified Experts</h3>
            <p className="text-slate-500 leading-relaxed font-medium">We vet every tutor manually. Only the top 3% of applicants make it onto LangConnect.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <Video size={44} className="text-emerald-600 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black text-slate-900 mb-4">Pro Classroom</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Crystal clear 4K video, interactive whiteboards, and real-time document sharing.</p>
          </div>
        </div>
      </section>

      {/* 4. TUTOR GRID (With integrated Loader) */}
      <section className="py-20 bg-slate-50 px-6 min-h-[600px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic underline decoration-emerald-200 decoration-8 underline-offset-4">Available Tutors</h2>
              <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-4">Top-rated professionals online now</p>
            </div>
          </div>
          
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <Loader />
              <p className="mt-4 text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Searching the globe...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
              {teachers.map(t => (
                <div key={t._id} className="bg-white border border-slate-100 rounded-[3.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
                  {/* Bookmark Toggle */}
                  <button className="absolute top-10 left-10 z-10 p-3 bg-white/80 backdrop-blur rounded-full text-slate-300 hover:text-red-500 shadow-sm transition-all active:scale-90">
                    <Heart size={20} />
                  </button>
                  
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-[2.5rem] mb-8">
                    <img 
                      src={t.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'} 
                      alt={t.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-5 py-2 rounded-2xl font-black text-emerald-600 shadow-xl">
                      ${t.teacherProfile.pricePerLesson}<span className="text-[10px] text-slate-400 ml-1">/hr</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.name}</h3>
                      <p className="text-emerald-600 font-black uppercase tracking-widest text-[9px]">{t.teacherProfile.language} Specialist</p>
                    </div>
                    <div className="flex items-center text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-xl text-xs italic border border-amber-100">
                      <Star size={14} className="fill-amber-500 mr-1.5" /> {t.teacherProfile.rating || '5.0'}
                    </div>
                  </div>

                  {/* Action */}
                  <Link 
                    to={`/teacher/${t._id}`} 
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.8rem] hover:bg-emerald-600 transition-all flex justify-center items-center shadow-lg group-hover:shadow-emerald-500/20 uppercase tracking-widest text-[10px]"
                  >
                    View Profile <ArrowUpRight size={18} className="ml-2" />
                  </Link>
                </div>
              ))}

              {teachers.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                   <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No tutors match your luxury search. Try adjusting the filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-40 px-6 bg-white text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] -z-10"></div>
        <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-12">Join the elite. <br/> Speak fluently.</h2>
        <Link 
          to="/register" 
          className="inline-block bg-emerald-600 text-white px-14 py-7 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 hover:-translate-y-1 transition-all active:scale-95"
        >
          Begin your journey now
        </Link>
      </section>
    </div>
  );
};

export default Home;