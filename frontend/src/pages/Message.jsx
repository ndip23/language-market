import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send, User } from 'lucide-react';

const Messages = ({ receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { token, user } = useContext(AuthContext);

  const fetchChat = async () => {
    const res = await axios.get(`/messages/${receiverId}`, {
      headers: { 'x-auth-token': token }
    });
    setMessages(res.data);
  };

  useEffect(() => { fetchChat(); }, [receiverId]);

  const onSend = async () => {
    await axios.post('/messages', { receiverId, content: text }, {
      headers: { 'x-auth-token': token }
    });
    setText('');
    fetchChat();
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl h-[600px] flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center bg-emerald-50/30">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black mr-4">{receiverName[0]}</div>
        <h3 className="text-xl font-black text-slate-900 italic">{receiverName}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-bold shadow-sm ${m.sender === user.id ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-900 rounded-bl-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-slate-50 flex space-x-4">
        <input 
          value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Type a luxury message..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 outline-none focus:border-emerald-600 font-bold"
        />
        <button onClick={onSend} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all"><Send size={20}/></button>
      </div>
    </div>
  );
};
export default Messages;