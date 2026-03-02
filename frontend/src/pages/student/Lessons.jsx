import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CreditCard, Video, Clock, CheckCircle2 } from 'lucide-react';
import { Loader } from '../../components/Loader';

const Lessons = () => {
  const { token } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/connections').then(res => setLessons(res.data)).finally(() => setLoading(false));
  }, [token]);

  const handlePayRedirect = (lesson) => {
    navigate('/dashboard/student/checkout', { state: { teacherId: lesson.teacher._id, teacherName: lesson.teacher.name, price: lesson.teacher.teacherProfile.pricePerLesson, connectionId: lesson._id } });
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8 underline decoration-emerald-200 decoration-8 underline-offset-8">My Schedule</h2>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {lessons.length === 0 ? (
          <div className="bg-white p-12 md:p-20 rounded-[2.5rem] md:rounded-[3rem] text-center border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-[10px]">No bookings found.</div>
        ) : (
          lessons.map(lesson => (
            <div key={lesson._id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center transition hover:shadow-xl space-y-6 md:space-y-0">
              <div className="flex items-center space-x-6 w-full md:w-auto">
                <div className={`p-4 rounded-xl font-black text-lg ${lesson.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
                    {lesson.isPaid ? <CheckCircle2 size={24}/> : <Clock size={24}/>}
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{lesson.teacher.name}</h4>
                  <p className="text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">${lesson.teacher.teacherProfile.pricePerLesson} Session Fee</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                 {!lesson.isPaid ? (
                   <button onClick={() => handlePayRedirect(lesson)} className="w-full md:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center">
                     <CreditCard size={16} className="mr-2" /> Pay Now
                   </button>
                 ) : (
                   <button className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl">
                     <Video size={16} className="mr-2" /> Start Class
                   </button>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Lessons;