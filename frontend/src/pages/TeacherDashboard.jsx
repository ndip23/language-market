import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, TrendingUp, ShieldCheck, Video, CreditCard } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [data, setData] = useState({ profile: {}, connections: [] });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetch = async () => {
      const config = { headers: { 'x-auth-token': token } };
      const profile = await axios.get(`/teachers/${user.id}`);
      const connections = await axios.get('i/dashboard/connections', config);
      setData({ profile: profile.data, connections: connections.data });
    };
    fetch();
  }, [token, user.id]);

  const handleSub = async (plan) => {
    const res = await axios.post('/payments/subscribe', { plan }, { headers: { 'x-auth-token': token } });
    window.location.href = res.data.paymentUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic underline decoration-emerald-200 decoration-8 underline-offset-8">Console</h1>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {['overview', 'students'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center"><Users size={14} className="mr-2"/> Students Connected</p>
                <div className="text-5xl font-black text-slate-900">{data.profile.subscription?.currentConnections || 0} <span className="text-slate-200">/</span> <span className="text-xl text-slate-400">{data.profile.subscription?.studentLimit || 0}</span></div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 border-b-emerald-500 border-b-8">
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center"><TrendingUp size={14} className="mr-2"/> Active Plan</p>
                <div className="text-5xl font-black text-emerald-600 capitalize">{data.profile.subscription?.plan || 'None'}</div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4 flex items-center"><ShieldCheck size={14} className="mr-2"/> Platform Status</p>
                <div className="text-xl font-black text-slate-900">{data.profile.teacherProfile?.isApproved ? 'VERIFIED TUTOR' : 'PENDING APPROVAL'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl">
                <h3 className="text-2xl font-black mb-2">Basic Tier</h3>
                <div className="text-6xl font-black mb-8 text-slate-900">$5<span className="text-sm font-bold text-slate-300">/mo</span></div>
                <ul className="text-slate-500 space-y-4 mb-10 font-medium italic"><li>• Get 6 new student connections</li><li>• Marketplace listing</li></ul>
                <button onClick={() => handleSub('basic')} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs shadow-lg">Activate Basic</button>
              </div>
              <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 font-black text-[10px] tracking-widest rounded-bl-3xl">POPULAR</div>
                <h3 className="text-2xl font-black mb-2 text-white">Professional Tier</h3>
                <div className="text-6xl font-black mb-8 text-white">$10<span className="text-sm font-bold text-slate-600">/mo</span></div>
                <ul className="text-slate-400 space-y-4 mb-10 font-medium italic"><li>• Get 20 new student connections</li><li>• Featured priority listing</li></ul>
                <button onClick={() => handleSub('pro')} className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/30">Activate Pro</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
            <h2 className="text-3xl font-black mb-10">Connection Manager</h2>
            <div className="space-y-6">
              {data.connections.map(conn => (
                <div key={conn._id} className="flex flex-col md:flex-row justify-between items-center p-8 bg-slate-50 rounded-[2rem] hover:bg-emerald-50/50 transition-colors">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-1">{conn.student.name}</h4>
                    <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Status: {conn.status}</p>
                  </div>
                  {conn.status === 'accepted' && (
                    <a href={conn.meetingLink} target="_blank" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center hover:bg-emerald-600 transition-all uppercase tracking-widest text-[10px]">
                      <Video size={16} className="mr-3" /> Start Class
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;