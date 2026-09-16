import React, { useState } from 'react';
import { X, Star, MessageSquare, Send } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ActivityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName: string;
  committeeId: string;
  initialActivityName?: string;
  onSubmitReview: (committeeId: string, review: { activityName: string; rating: number; comment: string }) => void;
}

import { useEffect } from 'react';
export default function ActivityReviewModal({ isOpen, onClose, committeeName, committeeId, initialActivityName, onSubmitReview }: ActivityReviewModalProps) {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    activityName: '',
    comment: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, activityName: initialActivityName || '' }));
      setRating(0);
    }
  }, [isOpen, initialActivityName]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast('error', 'يرجى تحديد التقييم بالنجوم أولاً.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmitReview(committeeId, {
        activityName: formData.activityName,
        rating,
        comment: formData.comment
      });
      
      addToast('success', 'تم إضافة تقييمك بنجاح! شكراً لمشاركتك.');
      setIsSubmitting(false);
      onClose();
      
      // Reset form
      setRating(0);
      setFormData({ activityName: '', comment: '' });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">تقييم نشاط سابق</h2>
              <p className="text-sm text-slate-500">{committeeName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:bg-slate-200 hover:text-slate-600 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">اسم النشاط أو الرحلة التي حضرتها</label>
            <input 
              type="text" 
              name="activityName"
              required
              placeholder="مثال: رحلة الأقصر، دوري الشطرنج..."
              value={formData.activityName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">تقييمك للنشاط</label>
            <div className="flex items-center justify-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">تعليقك ورأيك (اختياري)</label>
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-slate-400 absolute right-3 top-3" />
              <textarea 
                name="comment"
                rows={3}
                value={formData.comment}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                placeholder="كيف كانت تجربتك؟ ما الذي أعجبك وما الذي يمكن تحسينه..."
              ></textarea>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <span>جاري إرسال التقييم...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>نشر التقييم</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
