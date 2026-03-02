import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Star, Globe, ShieldCheck, Clock,
  CheckCircle2, MessageSquare, CreditCard, Sparkles, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleMessageTutor = () => {
    // 1. If not logged in: Redirect to Register but "pass" the tutor data
    if (!user) {
      toast("Sign up as a student to chat with " + teacher.name, { icon: '🔐' });
      navigate('/register', {
        state: {
          returnTo: `/dashboard/student/messages`,
          selectedTutor: teacher
        }
      });
      return;
    }

    // 2. If logged in as Teacher: Block
    if (user.role === 'teacher') {
      toast.error("Tutors cannot message other professionals.");
      return;
    }

    // 3. If logged in as Student: Go to chat instantly
    navigate('/dashboard/student/messages', { state: { selectedTutor: teacher } });
  };


  // 1. Fetch Teacher Data
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/teachers/${id}`);
        setTeacher(res.data);
      } catch (err) {
        toast.error("Tutor not found in our elite roster.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id, navigate]);

  // 2. Logic: Handle Booking Flow
  const handleBookingIntent = () => {
    // A. Security Check: Not Logged In
    if (!user) {
      toast.error("Please sign in as a student to book a session.");
      navigate('/login');
      return;
    }

    // B. Role Check: Teachers cannot book other teachers
    if (user.role === 'teacher') {
      toast.error("Access Denied: Teacher accounts cannot book sessions.");
      return;
    }

    // C. Success: Navigate to the Student Checkout Summary
    navigate('/dashboard/student/checkout', {
      state: {
        teacherId: teacher._id,
        teacherName: teacher.name,
        price: teacher.teacherProfile.pricePerLesson
      }
    });
  };

  if (loading) return <Loader />;
  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">

        {/* PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start">

          {/* LEFT: CONTENT AREA */}
          <div className="lg:col-span-2 space-y-12">

            {/* Header Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-10">
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-[3.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl">
                  <img
                    src={teacher.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'}
                    className="w-full h-full object-cover"
                    alt={teacher.name}
                  />
                </div>
                {teacher.teacherProfile?.isApproved && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white shadow-xl">
                    <ShieldCheck size={24} />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
                  <Sparkles size={12} className="mr-2" /> Verified Professional
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-none mb-6">
                  {teacher.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="flex items-center bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest">
                    <Globe size={14} className="mr-2 text-emerald-400" /> {teacher.teacherProfile.language} Specialist
                  </span>
                  <span className="flex items-center bg-amber-50 text-amber-600 px-5 py-2 rounded-full font-black text-[10px] uppercase border border-amber-100 italic">
                    <Star size={14} className="fill-amber-500 mr-2" /> {teacher.teacherProfile.rating || "5.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-bl-full"></div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 italic underline decoration-emerald-500 decoration-8 underline-offset-8">About the Lessons</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-xl max-w-3xl">
                {teacher.teacherProfile.bio || "This elite tutor is currently preparing their full curriculum. Book a session to discuss your specific learning goals."}
              </p>
            </div>

            {/* Visual Classroom (Gallery) */}
            {teacher.teacherProfile.gallery?.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-slate-900 italic ml-4">The Learning Environment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {teacher.teacherProfile.gallery.map((img, i) => (
                    <img key={i} src={img} className="w-full h-64 object-cover rounded-[3rem] shadow-lg border-4 border-white hover:scale-[1.02] transition-all" alt="Classroom" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: STICKY BOOKING CARD */}
          <div className="lg:col-span-1 pt-4">
            <div className="sticky top-32 bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] space-y-10">

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 italic">Investment per hour</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-7xl font-black text-slate-900 tracking-tighter italic">${teacher.teacherProfile.pricePerLesson}</span>
                  <span className="text-slate-400 font-bold text-sm uppercase">/ hr</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center text-slate-600 font-bold text-xs uppercase tracking-widest">
                  <CheckCircle2 size={18} className="text-emerald-500 mr-4 shrink-0" />
                  <span>Private 1-on-1 Sessions</span>
                </div>
                <div className="flex items-center text-slate-600 font-bold text-xs uppercase tracking-widest">
                  <Clock size={18} className="text-emerald-500 mr-4 shrink-0" />
                  <span>HD Digital Classroom</span>
                </div>
                <div className="flex items-center text-slate-600 font-bold text-xs uppercase tracking-widest">
                  <ShieldCheck size={18} className="text-emerald-500 mr-4 shrink-0" />
                  <span>Buyer Protection active</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleBookingIntent}
                  className="w-full bg-emerald-600 text-white py-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 transition-all flex items-center justify-center group active:scale-95 cursor-pointer"
                >
                  Book a Session <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </button>

                <button
                  onClick={handleMessageTutor}
                  className="w-full mt-4 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center shadow-xl shadow-slate-900/10 cursor-pointer border border-slate-800"
                >
                  <MessageSquare size={16} className="mr-3 text-emerald-500" /> Message Tutor
                </button>
              </div>

              <p className="text-[9px] text-center text-slate-300 font-bold leading-relaxed uppercase tracking-widest px-4">
                Bookings are secured via encrypted Swychr (AccountPe) payment links.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;