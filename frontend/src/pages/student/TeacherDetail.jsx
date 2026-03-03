import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  Star, Globe, ShieldCheck, Clock,
  ArrowLeft, CheckCircle2, MessageSquare, CreditCard, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext); // FIXED: Extracted user here
  
  const [hasBooked, setHasBooked] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  // 1. Fetch Teacher Data
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/teachers/${id}`);
        setTeacher(res.data);
      } catch (err) {
        toast.error("Tutor profile not found");
        navigate('/dashboard/student/find');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id, navigate]);

  // 2. Logic: Check if student has already booked this teacher to unlock messaging
  useEffect(() => {
    const checkBooking = async () => {
      try {
        const res = await axios.get('/dashboard/connections', {
            headers: { 'x-auth-token': token }
        });
        // Check if any connection matches this teacher ID
        const exists = res.data.some(conn => conn.teacher._id === id);
        setHasBooked(exists);
      } catch (err) { 
          console.log("Booking check error", err); 
      }
    };
    if (user && token) checkBooking();
  }, [id, user, token]);

  // 3. Action: Create Booking Request
  const handleBooking = async () => {
    setBooking(true);
    const tid = toast.loading("Sending request to tutor...");
    try {
      await axios.post('/connections/request',
        { teacherId: id },
        { headers: { 'x-auth-token': token } }
      );
      setSuccess(true);
      setHasBooked(true); // Unlock messaging immediately
      toast.success("Request sent successfully!", { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Booking failed", { id: tid });
    } finally {
      setBooking(false);
    }
  };

  // 4. Action: Handle Messaging Logic
  const handleMessageTutor = () => {
    if (!hasBooked) {
      toast.error("Messaging is locked. Please book a session first.", {
        icon: '🔒',
        style: { borderRadius: '1rem', background: '#0f172a', color: '#fff' }
      });
      return;
    }
    // Navigate to messages and pass the tutor data
    navigate('/dashboard/student/messages', {
      state: {
        selectedTutor: {
          _id: teacher._id,
          name: teacher.name,
          profilePicture: teacher.profilePicture,
          teacherProfile: teacher.teacherProfile
        }
      }
    });
  };

  if (loading) return <Loader />;
  if (!teacher) return null;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20 px-4 md:px-0">

      {/* HEADER NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-emerald-600 transition-all cursor-pointer"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">

        {/* LEFT COLUMN: BIO & GALLERY */}
        <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">

          {/* Main Info Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative shrink-0">
              <img
                src={teacher.profilePicture || 'https://images.unsplash.com/photo-1544717305-2782549b5136'}
                className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] md:rounded-[3rem] object-cover border-4 border-white shadow-2xl"
                alt={teacher.name}
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="pt-4">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-4 leading-none">{teacher.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest border border-emerald-100">
                   <Sparkles size={12} className="inline mr-1 mb-0.5" /> {teacher.teacherProfile.language} Specialist
                </span>
                <div className="flex items-center bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-black text-[9px] md:text-[10px] uppercase border border-amber-100 italic">
                  <Star size={14} className="fill-amber-500 mr-2" /> {teacher.teacherProfile.rating || "5.0"} Rating
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 italic underline decoration-emerald-200 decoration-8 underline-offset-4">Tutor Biography</h3>
            <p className="text-slate-500 font-medium leading-loose text-base md:text-lg">
              {teacher.teacherProfile.bio || "No biography provided by this tutor yet."}
            </p>
          </div>

          {/* Gallery */}
          {teacher.teacherProfile.gallery && teacher.teacherProfile.gallery.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 italic ml-4">Classroom Insights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teacher.teacherProfile.gallery.map((img, i) => (
                  <img key={i} src={img} className="w-full h-48 object-cover rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:scale-105 transition-all border-2 border-white" alt="Gallery" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING CARD */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-10 bg-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-800 space-y-8 overflow-hidden">
            {/* Design Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <p className="text-[9px] md:text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em] mb-2 italic">Standard Hourly Rate</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl md:text-6xl font-black italic tracking-tighter">${teacher.teacherProfile.pricePerLesson}</span>
                <span className="text-slate-500 font-bold text-xs md:text-sm uppercase">/ Lesson</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center text-[11px] md:text-xs font-bold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-500 mr-3 shrink-0" />
                <span>Verified 1-on-1 Sessions</span>
              </div>
              <div className="flex items-center text-[11px] md:text-xs font-bold text-slate-300">
                <Clock size={16} className="text-emerald-500 mr-3 shrink-0" />
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center text-[11px] md:text-xs font-bold text-slate-300">
                <ShieldCheck size={16} className="text-emerald-500 mr-3 shrink-0" />
                <span>Secure platform room</span>
              </div>
            </div>

            <div className="pt-6 relative z-10 space-y-4">
              {success ? (
                <div className="bg-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center border border-emerald-500/30">
                  <CheckCircle2 size={32} className="mx-auto mb-3" />
                  <p className="font-black text-[10px] uppercase tracking-widest">Request Sent Successfully</p>
                  <p className="text-[9px] mt-1 font-bold italic">Unlock messaging in your inbox</p>
                </div>
              ) : (
                <button
                  disabled={booking}
                  onClick={handleBooking}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-white hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {booking ? "Processing..." : "Book First Lesson"}
                </button>
              )}

              <button
                onClick={handleMessageTutor}
                className={`w-full py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center border transition-all cursor-pointer ${
                  hasBooked
                    ? 'bg-white/5 text-white border-white/10 hover:bg-white hover:text-slate-900'
                    : 'bg-white/5 text-slate-500 border-transparent opacity-40'
                  }`}
              >
                <MessageSquare size={14} className={`mr-2 ${hasBooked ? 'text-emerald-500' : 'text-slate-600'}`} />
                {hasBooked ? "Message Tutor" : "Messaging Locked"}
              </button>
              
              {!hasBooked && (
                 <p className="text-[8px] text-center text-slate-500 font-bold uppercase tracking-widest">Book a lesson to unlock chat</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDetail;