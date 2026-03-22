import { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, User } from 'lucide-react';
const socket = io('https://language-market.onrender.com');

const ChatWindow = ({ receiverId, receiverName }) => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('join_room', user.id);
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, [user.id]);

  const handleSend = () => {
    const data = { senderId: user.id, receiverId, content: message };
    socket.emit('send_message', data);
    setChat((prev) => [...prev, data]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center bg-slate-50/50">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
          <User className="text-emerald-600" size={20} />
        </div>
        <h3 className="font-black text-slate-900">{receiverName}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-6 py-3 rounded-[1.5rem] font-medium text-sm shadow-sm ${
              msg.senderId === user.id 
              ? 'bg-emerald-600 text-white rounded-br-none' 
              : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-50 flex space-x-4">
        <input 
          type="text" value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-6 py-3 outline-none focus:border-emerald-500 font-medium"
        />
        <button onClick={handleSend} className="bg-slate-900 text-white p-3 rounded-full hover:bg-emerald-600 transition-all">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};