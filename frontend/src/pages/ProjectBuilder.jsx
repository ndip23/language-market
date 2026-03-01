const ProfileBuilder = () => (
  <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-xl max-w-4xl mx-auto">
    <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Profile Details</h2>
    <p className="text-slate-500 font-medium mb-12 uppercase tracking-widest text-xs">This is how students will see you</p>
    
    <div className="space-y-10">
      {/* Big Bio Input */}
      <div>
        <label className="block text-slate-900 font-black text-sm uppercase tracking-widest mb-4">Professional Biography</label>
        <textarea 
          placeholder="Share your teaching philosophy..."
          className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-emerald-500 min-h-[250px] shadow-inner"
        />
      </div>

      {/* Grid for Price and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-slate-900 font-black text-sm uppercase tracking-widest mb-4">Lesson Price ($/hr)</label>
          <input 
            type="number" placeholder="e.g. 45"
            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 text-slate-900 placeholder-slate-400 font-bold outline-none focus:border-emerald-500 shadow-inner"
          />
        </div>
        <div>
          <label className="block text-slate-900 font-black text-sm uppercase tracking-widest mb-4">Teaching Language</label>
          <select className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 text-slate-900 font-bold outline-none focus:border-emerald-500 shadow-inner">
             <option>English</option>
             <option>French</option>
          </select>
        </div>
      </div>

      <button className="bg-emerald-600 text-white font-black px-12 py-5 rounded-luxury hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest">
        Save Profile
      </button>
    </div>
  </div>
);