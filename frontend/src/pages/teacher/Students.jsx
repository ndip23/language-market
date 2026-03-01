import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Video, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

const TeacherStudents = () => {
  const { token, user } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/connections', {
        headers: { 'x-auth-token': token }
      });
      setConnections(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConnections(); }, [token]);

  const handleAccept = async (id) => {
    const tid = toast.loading("Checking student limit...");
    try {
      await axios.put(`http://localhost:5000/api/connections/${id}/accept`, {}, {
        headers: { 'x-auth-token': token }
      });
      toast.success("Student accepted!", { id: tid });
      fetchConnections();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Limit reached. Upgrade your plan.", { id: tid });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-2">Connection Manager</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Manage requests and active students</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
            <span className="text-emerald-600 font-black text-xs uppercase">Usage: {user?.subscription?.currentConnections} / {user?.subscription?.studentLimit} Students</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {connections.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-xs tracking-widest">No student requests yet.</div>
        ) : (
          connections.map(conn => (
            <div key={conn._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center transition hover:shadow-xl group">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                    {conn.student.profilePicture ? <img src={conn.student.profilePicture} className="w-full h-full object-cover" /> : <User size={30} />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">{conn.student.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{conn.student.email}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${conn.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {conn.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 flex items-center space-x-4">
                {conn.status === 'pending' && (
                  <button onClick={() => handleAccept(conn._id)} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-slate-900 transition-all">
                    Accept Student
                  </button>
                )}
                {conn.status === 'accepted' && (
                  <a href={conn.meetingLink} target="_blank" className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-emerald-600 transition-all shadow-xl">
                    <Video size={16} className="mr-3" /> Enter Classroom
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;