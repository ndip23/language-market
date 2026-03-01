import { Search, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ onSearch }) => (
  <div className="max-w-6xl mx-auto px-6 mb-16">
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
      
      {/* Language Toggle */}
      <div className="w-full md:w-1/4 relative group">
        <select 
          onChange={(e) => onSearch('language', e.target.value)}
          className="w-full bg-slate-50 border border-transparent rounded-[1.5rem] px-6 py-4 outline-none focus:border-emerald-500 font-bold text-slate-900 appearance-none"
        >
          <option value="">Any Language</option>
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
      </div>

      {/* Price Slider/Range Input */}
      <div className="w-full md:w-2/4 flex items-center bg-slate-50 rounded-[1.5rem] px-6 py-4 border border-transparent focus-within:border-emerald-500 transition-all">
        <span className="text-slate-400 font-bold mr-4 italic">Max Price:</span>
        <input 
          type="range" min="10" max="200" step="5"
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          onChange={(e) => onSearch('maxPrice', e.target.value)}
        />
        <span className="ml-4 text-emerald-600 font-black">$200</span>
      </div>

      {/* Modern Search Button */}
      <button className="w-full md:w-1/4 bg-slate-900 text-white font-black py-4 rounded-[1.5rem] hover:bg-emerald-600 transition-all flex justify-center items-center shadow-lg shadow-slate-900/10">
        <Search size={20} className="mr-3" /> Update Results
      </button>
    </div>
  </div>
);