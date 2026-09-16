import React, { useState } from 'react';
import { X, Send, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface ActivityRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeName: string;
}

export default function ActivityRegistrationModal({ isOpen, onClose, committeeName }: ActivityRegistrationModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    phone: '',
    activityName: '',
    motivation: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          committee: committeeName
        })
      });
      
      if (response.ok) {
        addToast('success', 'تم التسجيل بنجاح! راجع مركز الإشعارات للتأكيد.');
        onClose();
        // Reset form
        setFormData({
          name: '',
          studentId: '',
          phone: '',
          activityName: '',
          motivation: ''
        });
      } else {
        throw new Error('حدث خطأ');
      }
    } catch (err) {
      addToast('error', 'حدث خطأ أثناء إرسال طلب التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">نموذج التسجيل في الأنشطة</h2>
          </div>
          <p className="text-blue-100 text-sm">التسجيل بـ {committeeName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">اسم النشاط أو الرحلة المحددة</label>
            <input 
              type="text" 
              name="activityName"
              required
              placeholder="مثال: رحلة الأقصر، دوري الشطرنج..."
              value={formData.activityName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">الاسم الرباعي</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">الرقم الجامعي</label>
              <input 
                type="text" 
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الهاتف للتواصل</label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white"
                dir="ltr"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">لماذا ترغب في الانضمام؟ (اختياري)</label>
            <textarea 
              name="motivation"
              rows={3}
              value={formData.motivation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-slate-50 focus:bg-white resize-none"
              placeholder="خبرات سابقة أو مهارات تود تطويرها..."
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>تأكيد التسجيل</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
