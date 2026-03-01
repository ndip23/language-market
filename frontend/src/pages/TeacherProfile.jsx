import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Star, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TeacherProfile = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [teacher, setTeacher] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/teachers/${id}`).then(res => setTeacher(res.data));
  }, [id]);

  const handleBook = async () => {
    try {
      await axios.post('http://localhost:5000/api/connections/request', { teacherId: id }, { headers: { 'x-auth-token': token } });
      setStatus('success');
    } catch (err) { alert(err.response.data.msg); }
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left: Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-8 mb-12">
            <img src={teacher.teacherProfile.photo} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl shadow-emerald-100" />
            <div>
              <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">{teacher.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full font-bold text-sm uppercase tracking-wider">{teacher.teacherProfile.language} Tutor</span>
                <span className="flex items-center text-amber-500 font-bold"><Star size={18} className="fill-amber-500 mr-1" /> {teacher.teacherProfile.rating || "5.0"}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-slate lg:prose-xl font-light text-slate-600 leading-relaxed mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Lessons</h2>
            {teacher.teacherProfile.bio}
          </div>

          <div className="grid grid-cols-2 gap-4">
             {teacher.teacherProfile.gallery?.map((img, i) => (
               <img key={i} src={img} className="w-full h-64 object-cover rounded-[2rem]" />
             ))}
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50">
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-slate-900">${teacher.teacherProfile.pricePerLesson}</span>
              <span className="text-slate-400 font-medium ml-2">/ hour</span>
            </div>

            <div className="space-y-4 mb-10">
               <div className="flex items-center text-slate-600"><ShieldCheck className="text-emerald-500 mr-3" /> Professional verification</div>
               <div className="flex items-center text-slate-600"><Globe className="text-emerald-500 mr-3" /> Live 1-on-1 sessions</div>
            </div>

            {status === 'success' ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex flex-col items-center text-center">
                <CheckCircle2 size={32} className="mb-2" />
                <p className="font-bold">Request Sent!</p>
              </div>
            ) : (
              <button onClick={handleBook} className="w-full bg-emerald-600 text-white font-bold py-5 rounded-3xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-500/20">
                Book a Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;