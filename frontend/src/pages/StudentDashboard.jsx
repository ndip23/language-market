import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Video, CreditCard, Clock, CheckCircle2, Camera, Sparkles } from 'lucide-react';

const StudentDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('/dashboard/connections', {
          headers: { 'x-auth-token': token }
        });
        setConnections(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (user) fetchDocs();
  }, [user, token]);

  const handlePay = async (id) => {
    try {
      const res = await axios.post('/payments/lesson', { connectionId: id }, {
        headers: { 'x-auth-token': token }
      });
      window.location.href = res.data.paymentUrl; // Redirect to Swychr
    } catch (err) { alert("Payment failed to initialize."); }
  };

  if (loading) return <div className="min-h-screen bg-white flex justify-center items-center text-emerald-600 font-bold">Loading Space...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-16">
          <div className="relative group shrink-0">
            <img 
              src={user?.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250"} 
              className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl shadow-slate-200" 
            />
            <label className="absolute inset-0 flex items-center justify-center bg-emerald-600/80 rounded-[2.5rem] opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <Camera size={24} className="text-white" />
              <input type="file" className="hidden" />
            </label>
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles size={14} className="mr-2" /> Student Account
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Hi, {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-2 font-medium">You have {connections.length} active lesson requests.</p>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Your Language Tutors</h2>
          {connections.map(conn => (
            <div key={conn._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{conn.teacher.name}</h3>
                <div className="flex items-center text-emerald-600 font-bold text-sm mb-4">
                  <span className="bg-emerald-50 px-4 py-1 rounded-full mr-3">${conn.teacher.teacherProfile.pricePerLesson} / hr</span>
                  <span>{conn.teacher.teacherProfile.language}</span>
                </div>
                
                <div className="flex items-center text-slate-500 text-sm font-semibold">
                  {conn.status === 'pending' && <span className="flex items-center text-amber-500"><Clock size={16} className="mr-2" /> Pending Approval</span>}
                  {conn.status === 'accepted' && !conn.isPaid && <span className="flex items-center text-blue-500"><CheckCircle2 size={16} className="mr-2" /> Accepted - Payment Required</span>}
                  {conn.isPaid && <span className="flex items-center text-emerald-500"><CheckCircle2 size={16} className="mr-2" /> Lesson Confirmed</span>}
                </div>
              </div>

              <div className="flex space-x-4">
                {conn.status === 'accepted' && !conn.isPaid && (
                  <button onClick={() => handlePay(conn._id)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 flex items-center transition-all">
                    <CreditCard size={18} className="mr-2" /> Pay for Lesson
                  </button>
                )}
                {conn.isPaid && conn.meetingLink && (
                  <a href={conn.meetingLink} target="_blank" rel="noreferrer" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center hover:bg-emerald-600 transition-all">
                    <Video size={18} className="mr-2" /> Join Video Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;