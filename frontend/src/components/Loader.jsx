export const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-emerald-600"></div>
  </div>
);

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[999] flex justify-center items-center">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-600 border-r-4 border-r-transparent"></div>
      <p className="mt-4 text-slate-900 font-black text-xs uppercase tracking-widest animate-pulse">Processing...</p>
    </div>
  </div>
);