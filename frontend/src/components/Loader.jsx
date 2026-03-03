import React from 'react';
import Logo from './Logo';

export const FullPageLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[9999] flex justify-center items-center pointer-events-auto">
    <div className="flex flex-col items-center bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 mx-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-emerald-600 border-r-4 border-r-transparent shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-10 text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse italic text-center">
        {message || "Securing Gateway Connection..."}
      </p>
      <p className="mt-4 text-slate-400 font-bold text-[8px] uppercase tracking-widest opacity-50">Please remain on this screen</p>
    </div>
  </div>
);

export const Loader = () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-emerald-600 border-r-4 border-r-transparent"></div>
    </div>
);