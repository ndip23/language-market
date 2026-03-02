import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';

const FindTutors = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ language: '', maxPrice: '' });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/teachers?language=${filters.language}&maxPrice=${filters.maxPrice}`).then(res => {
      setTeachers(res.data);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">Discovery</h2>
        
        {/* Responsive Filter Bar */}
        <div className="flex items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-xl w-full md:w-auto">
            <select className="flex-1 md:w-auto bg-transparent px-4 py-2 font-black text-[9px] uppercase outline-none" onChange={(e) => setFilters({...filters, language: e.target.value})}>
                <option value="">All Languages</option><option value="English">English</option><option value="French">French</option>
            </select>
            <div className="w-px h-6 bg-slate-100 mx-2"></div>
            <input type="number" placeholder="Max Price" className="w-24 bg-transparent px-4 py-2 font-black text-[9px] outline-none" onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teachers.map(t => (
            <div key={t._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all group relative">
               <div className="relative overflow-hidden rounded-[2rem] mb-6">
                  <img src={t.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'} className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-1000" alt=""/>
                  <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-2 rounded-xl font-black text-emerald-600 shadow-xl text-xs">${t.teacherProfile.pricePerLesson}/hr</div>
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-1">{t.name}</h3>
               <div className="flex items-center justify-between mb-6">
                   <p className="text-emerald-600 font-black uppercase text-[9px]">{t.teacherProfile.language} Specialist</p>
                   <div className="flex items-center text-amber-500 font-black text-[10px]"><Star size={12} className="fill-amber-500 mr-1" /> {t.teacherProfile.rating || '5.0'}</div>
               </div>
               <Link to={`/dashboard/student/teacher/${t._id}`} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-all flex justify-center items-center uppercase tracking-widest text-[9px]">
                  View Profile <ArrowUpRight size={14} className="ml-2" />
               </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FindTutors;