import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Heart, Star, ArrowRight, Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';

const SavedTutors = () => {
  const { token } = useContext(AuthContext);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get('/students/saved', {
          headers: { 'x-auth-token': token }
        });
        setSaved(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-12 underline decoration-emerald-200 decoration-8 underline-offset-8">Bookmarks</h2>

      {saved.length === 0 ? (
        /* LUXURY EMPTY STATE */
        <div className="bg-white rounded-[3rem] p-20 border border-slate-100 shadow-sm flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
            <Bookmark size={40} className="text-emerald-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Your collection is empty</h3>
          <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
            Save your favorite elite tutors here to easily book lessons and track your fluency journey.
          </p>
          <Link to="/dashboard/student/find" className="bg-slate-900 text-white px-12 py-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 group">
            Find a Tutor <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      ) : (
        /* GRID IF DATA EXISTS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {saved.map(t => (
            <div key={t._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all">
              <Heart className="absolute top-10 right-10 text-red-500 fill-red-500 z-10" />
              <div className="relative overflow-hidden rounded-[2rem] mb-6">
                <img src={t.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
              <h3 className="text-xl font-black text-slate-900">{t.name}</h3>
              <div className="flex items-center text-amber-500 text-xs font-bold mt-1 mb-6">
                <Star size={14} className="fill-amber-500 mr-1" /> {t.teacherProfile.rating || '5.0'}
              </div>
              <Link to={`/teacher/${t._id}`} className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                Book Again <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTutors;