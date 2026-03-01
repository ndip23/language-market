import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Send, User, Search, MessageSquare, Inbox } from 'lucide-react'; // Added MessageSquare and Inbox
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

// Initialize socket outside or inside with useMemo to prevent multiple connections
const socket = io('http://localhost:5000');

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // 1. Socket Logic
  useEffect(() => {
    if (user?.id) {
      socket.emit('join_room', user.id);
      
      const handleNewMessage = (data) => {
        // If we are currently chatting with the person who sent this
        if (activeChat && data.sender === activeChat._id) {
          setMessages((prev) => [...prev, data]);
        } else {
          toast(`New message from ${data.senderName || 'Tutor'}`, { icon: '💬' });
        }
      };

      socket.on('receive_message', handleNewMessage);
      return () => socket.off('receive_message', handleNewMessage);
    }
  }, [user, activeChat]);

  // 2. Fetch Tutors (Connections)
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/connections', {
          headers: { 'x-auth-token': token }
        });
        // Filter unique tutors from connections
        const uniqueTutors = res.data.map(c => c.teacher).filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
        setConversations(uniqueTutors);
      } catch (err) {
        console.error("Inbox error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTutors();
  }, [token]);

  // 3. Fetch History
  useEffect(() => {
    if (activeChat?._id) {
      axios.get(`http://localhost:5000/api/messages/${activeChat._id}`, {
        headers: { 'x-auth-token': token }
      }).then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }
  }, [activeChat, token]);

  // 4. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeChat) return;

    const msgData = { 
      receiverId: activeChat._id, 
      content: text, 
      sender: user.id,
      senderName: user.name 
    };

    try {
      socket.emit('send_message', msgData);
      await axios.post('http://localhost:5000/api/messages', msgData, {
        headers: { 'x-auth-token': token }
      });
      setMessages([...messages, msgData]);
      setText('');
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
      
      {/* LEFT: INBOX LIST */}
      <div className="w-80 border-r border-slate-50 flex flex-col bg-white">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4 italic">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input placeholder="Search chats..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-emerald-500/10" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-slate-300 font-bold text-[10px] uppercase tracking-widest leading-loose">
              No tutors to <br/> message yet.
            </div>
          ) : (
            conversations.map(tutor => (
              <button 
                key={tutor?._id} 
                onClick={() => setActiveChat(tutor)}
                className={`w-full p-6 flex items-center space-x-4 border-b border-slate-50 transition-all ${activeChat?._id === tutor?._id ? 'bg-emerald-50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}
              >
                <img src={tutor?.profilePicture || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt=""/>
                <div className="text-left overflow-hidden">
                  <p className="font-black text-slate-900 text-sm truncate">{tutor?.name}</p>
                  <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{tutor?.teacherProfile?.language}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: CHAT AREA */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-slate-50/20">
          {/* Chat Header */}
          <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center space-x-4">
               <img src={activeChat.profilePicture} className="w-10 h-10 rounded-xl object-cover" alt=""/>
               <div>
                <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">{activeChat.name}</h3>
                <span className="text-[9px] text-emerald-500 font-bold italic underline">Online Now</span>
               </div>
             </div>
          </div>
          
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-6 py-4 rounded-[2rem] text-sm font-semibold shadow-sm ${
                  m.sender === user.id 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-900 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Bar */}
          <div className="p-6 bg-white border-t border-slate-100 flex space-x-4">
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write a message..." 
              className="flex-1 bg-slate-50 border-none rounded-2xl px-8 py-4 outline-none font-bold text-sm focus:ring-2 ring-emerald-500/10" 
            />
            <button 
              onClick={sendMessage}
              className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20 active:scale-90"
            >
              <Send size={20}/>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/10">
          <div className="bg-white p-10 rounded-full shadow-2xl shadow-slate-200/50 mb-8">
            <Inbox size={64} className="text-emerald-100" />
          </div>
          <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300">Select a conversation to start</p>
        </div>
      )}
    </div>
  );
};

export default Messages;