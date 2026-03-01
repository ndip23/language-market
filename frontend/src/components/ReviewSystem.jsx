import { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewSystem = ({ teacherId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    // API call to POST /api/reviews
    alert(`Rating: ${rating}, Comment: ${comment}`);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 mt-12">
      <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight italic underline decoration-emerald-200 decoration-8">Leave a Review</h3>
      
      {/* Interactive Stars */}
      <div className="flex space-x-3 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-125"
          >
            <Star 
              size={32} 
              className={`${(hover || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
            />
          </button>
        ))}
      </div>

      <textarea 
        className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-slate-900 font-medium outline-none focus:border-emerald-500 mb-6 h-32"
        placeholder="How was your lesson?"
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submitReview} className="bg-emerald-600 text-white font-black px-10 py-4 rounded-full hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs">
        Submit Feedback
      </button>
    </div>
  );
};