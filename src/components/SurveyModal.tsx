import React, { useState } from 'react';
import { Star, X, Send, CheckCircle } from 'lucide-react';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  onSubmit: (rating: number, feedback: string) => void;
}

export default function SurveyModal({ isOpen, onClose, activityName, onSubmit }: SurveyModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, feedback);
      setIsSubmitted(false);
      setRating(0);
      setFeedback('');
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-50" dir="rtl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">تقييم النشاط</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-800 mb-2">شكراً لمشاركتك!</h4>
              <p className="text-slate-500">رأيك يهمنا ويساعدنا في تحسين الأنشطة القادمة.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <p className="text-slate-600 mb-2">ما هو تقييمك لـ <span className="font-bold text-slate-800">{activityName}</span>؟</p>
                <div className="flex justify-center gap-2" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea 
                  rows={3} 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" 
                  placeholder="حدثنا عن تجربتك وما يمكننا تحسينه..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={rating === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                إرسال التقييم
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
