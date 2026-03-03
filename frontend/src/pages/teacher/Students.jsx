import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Video, User } from 'lucide-react';
import TeacherPaywallView from '../../components/TeacherPaywallView';
import { Loader } from '../../components/Loader';

const TeacherStudents = () => {
  const { user, token } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. REVENUE CHECK
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';

  useEffect(() => {
    if (hasPlan) {
      axios.get('/dashboard/connections')
        .then(res => setConnections(res.data))
        .finally(() => setLoading(false));
    }
  }, [hasPlan]);

  // 2. SHOW PAYWALL IF NO PLAN
  if (!hasPlan) {
    return (
      <TeacherPaywallView 
        title="Manage your future" 
        feature="Student Roster" 
        benefit="View student requests, manage your schedule, and access your high-definition video classroom tools."
      />
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">My Active Students</h2>
      <div className="grid grid-cols-1 gap-6 max-w-5xl">
        {connections.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-xs">No active students found.</div>
        ) : (
          connections.map(conn => (
            <div key={conn._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center transition hover:shadow-xl">
              <div className="flex items-center space-x-6">
                <img src={conn.student.profilePicture} className="w-16 h-16 rounded-2xl object-cover" alt=""/>
                <div>
                  <h4 className="text-xl font-black text-slate-900">{conn.student.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{conn.student.email}</p>
                </div>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-emerald-600 transition-all">
                 <Video size={16} className="mr-3" /> Start Lesson
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;