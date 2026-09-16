import React, { useState } from 'react';
import { AlertTriangle, X, PhoneCall } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSosSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call for emergency request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      showToast('تم إرسال نداء الاستغاثة بنجاح. يرجى البقاء في مكانك، سيتواصل معك فريق الرعاية فوراً.', 'error');
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 sm:bottom-6 sm:right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="نداء استغاثة (SOS)"
        title="استغاثة طارئة"
      >
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-lg">نداء استغاثة طارئ (SOS)</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <PhoneCall className="w-7 h-7" />
              </div>
              <p className="text-slate-800 font-bold mb-2 text-lg">هل تواجه مشكلة طارئة؟</p>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                سيتم إرسال تنبيه فوري وعاجل لمكتب رعاية الطلاب للتدخل والمساعدة. هل أنت متأكد من رغبتك في إرسال النداء؟
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSosSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'إرسال التنبيه'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
