import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Video, CreditCard, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader, FullPageLoader } from '../../components/Loader';

const Lessons = () => {
  const { token } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchLessons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/connections');
      setLessons(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLessons(); }, []);

  const handlePay = async (connId) => {
    setPaying(true);
    const tid = toast.loading("Opening secure payment...");
    try {
      const res = await axios.post('http://localhost:5000/api/payments/lesson', { connectionId: connId });
      
      // REDIRECT TO SWYCHR
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      toast.error("Payment error. Try again.", { id: tid });
      setPaying(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {paying && <FullPageLoader />}
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">Lesson History</h2>
      {lessons.map(lesson => (
        <div key={lesson._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div>
            <h4 className="text-xl font-black text-slate-900">{lesson.teacher.name}</h4>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1">${lesson.teacher.teacherProfile.pricePerLesson} Session Fee</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-4">
             {/* If accepted but not paid, show the Swychr Button */}
             {lesson.status === 'accepted' && !lesson.isPaid && (
               <button 
                 onClick={() => handlePay(lesson._id)}
                 className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all flex items-center"
               >
                 <CreditCard size={16} className="mr-2" /> Pay with AccountPe
               </button>
             )}
             
             {lesson.isPaid && (
                <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center shadow-xl hover:bg-emerald-600 transition-all">
                  <Video size={16} className="mr-2" /> Enter Room
                </button>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lessons;