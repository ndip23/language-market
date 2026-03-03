import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Send, Search, Inbox, User, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Loader } from '../../components/Loader';

const socket = io('http://localhost:5000');

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({}); // 🚨 State for WhatsApp-style badges
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // 1. INITIAL DATA FETCH: Conversations + Unread Counts
  const fetchData = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      
      // Fetch Connections
      const res = await axios.get('/dashboard/connections', config);
      let participantList = res.data.map(c => 
        user.role === 'teacher' ? c.student : c.teacher
      ).filter(p => p !== null);

      let uniqueParticipants = participantList.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
      
      // Fetch Unread Counts from Backend
      const unreadRes = await axios.get('/messages/unread/count', config);
      const countMap = unreadRes.data.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
      setUnreadCounts(countMap);

      // Handle redirect from "Message Tutor" button
      const incomingUser = location.state?.selectedTutor;
      if (incomingUser) {
        if (!uniqueParticipants.find(t => t._id === incomingUser._id)) {
          uniqueParticipants = [incomingUser, ...uniqueParticipants];
        }
        setActiveChat(incomingUser);
      }

      setConversations(uniqueParticipants);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) fetchData();
  }, [token, user, location.state]);

  // 2. MARK AS READ & FETCH HISTORY: When activeChat changes
  useEffect(() => {
    if (activeChat?._id) {
      const config = { headers: { 'x-auth-token': token } };

      // Mark messages as read in DB
      axios.put(`/messages/read/${activeChat._id}`, {}, config);
      
      // Reset count locally for this user
      setUnreadCounts(prev => ({ ...prev, [activeChat._id]: 0 }));

      // Fetch history
      axios.get(`/messages/${activeChat._id}`, config)
        .then(res => setMessages(res.data));
    }
  }, [activeChat, token]);

  // 3. SOCKET: Real-time Message + Badge Update
  useEffect(() => {
    if (user?.id) {
      socket.emit('join_room', user.id);
      
      const handleNewMessage = (data) => {
        // If chat is open, add message and mark read
        if (activeChat && data.sender === activeChat._id) {
          setMessages((prev) => [...prev, data]);
          axios.put(`/messages/read/${data.sender}`, {}, { headers: { 'x-auth-token': token } });
        } else {
          // If chat is CLOSED, increment the unread badge
          setUnreadCounts(prev => ({
            ...prev,
            [data.sender]: (prev[data.sender] || 0) + 1
          }));
          toast(`New message from ${data.senderName}`, { icon: '💬' });
        }
      };

      socket.on('receive_message', handleNewMessage);
      return () => socket.off('receive_message');
    }
  }, [user, activeChat, token]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 4. SEND ACTION
  const sendMessage = async () => {
    if (!text.trim() || !activeChat) return;
    const msgData = { receiverId: activeChat._id, content: text, sender: user.id, senderName: user.name };
    try {
      socket.emit('send_message', msgData);
      await axios.post('/messages', msgData);
      setMessages([...messages, msgData]);
      setText('');
    } catch (err) { toast.error("Delivery failed."); }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      
      {/* SIDEBAR: CONVERSATION LIST */}
      <div className={`w-full md:w-80 border-r border-slate-50 flex flex-col bg-white ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b">
          <h2 className="text-2xl font-black text-slate-900 mb-6 italic tracking-tighter">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input placeholder="Search..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 text-[10px] font-black uppercase tracking-widest outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-12 text-center text-slate-300 font-bold text-[10px] uppercase tracking-widest opacity-50">Empty.</div>
          ) : (
            conversations.map(participant => {
              const unread = unreadCounts[participant._id] || 0; // 🚨 Get the badge number
              return (
                <button 
                  key={participant._id} 
                  onClick={() => setActiveChat(participant)} 
                  className={`w-full p-5 md:p-6 flex items-center justify-between border-b transition-all ${activeChat?._id === participant._id ? 'bg-emerald-50/50 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <img src={participant.profilePicture || `https://ui-avatars.com/api/?name=${participant.name}&background=10b981&color=fff`} className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white" alt=""/>
                    <div className="text-left overflow-hidden">
                      <p className="font-black text-slate-900 text-sm truncate">{participant.name}</p>
                      <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest italic">{participant.role}</p>
                    </div>
                  </div>

                  {/* 🚨 THE WHATSAPP STYLE BADGE */}
                  {unread > 0 && activeChat?._id !== participant._id && (
                    <div className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-lg animate-in zoom-in">
                      {unread}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-slate-50/20">
          {/* Chat Header */}
          <div className="p-4 md:p-6 bg-white border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
             <div className="flex items-center space-x-4">
               <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-slate-400"><ArrowLeft size={20}/></button>
               <img src={activeChat.profilePicture || `https://ui-avatars.com/api/?name=${activeChat.name}&background=10b981&color=fff`} className="w-10 h-10 rounded-xl object-cover" alt=""/>
               <div>
                <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">{activeChat.name}</h3>
                <div className="flex items-center text-[8px] text-emerald-500 font-bold italic"><ShieldCheck size={10} className="mr-1"/> Private Session</div>
               </div>
             </div>
          </div>
          
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[2rem] text-sm font-semibold shadow-sm ${
                  m.sender === user.id ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border text-slate-900 rounded-bl-none'
                }`}>{m.content}</div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 md:p-6 bg-white border-t flex space-x-3 md:space-x-4 items-center">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3 md:px-8 md:py-4 outline-none font-bold text-sm" />
            <button onClick={sendMessage} className="bg-emerald-600 text-white p-3 md:p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg active:scale-90"><Send size={20}/></button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/10">
            <div className="bg-white p-12 rounded-full shadow-2xl mb-8 border border-slate-50"><MessageSquare size={64} className="text-emerald-100" /></div>
            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300 italic">Select conversation</p>
        </div>
      )}
    </div>
  );
};

export default Messages;