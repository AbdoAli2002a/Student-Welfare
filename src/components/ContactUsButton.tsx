import React, { useState } from 'react';
import { Mail, MessageCircle, X, Phone } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function ContactUsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  const handleEmail = () => {
    window.location.href = 'mailto:student-welfare@university.edu.eg';
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/201000000000', '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 left-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-green-700 hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="تواصل معنا"
        title="تواصل معنا"
      >
        <Phone className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-green-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <h3 className="font-bold text-lg">تواصل مع رعاية الطلاب</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-600 text-sm mb-6 text-center leading-relaxed">
                اختر وسيلة التواصل المناسبة لك وسيسعدنا الرد على جميع استفساراتك.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-start gap-4 p-4 border border-green-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-slate-800">محادثة واتساب</h4>
                    <p className="text-xs text-slate-500">للاستفسارات السريعة</p>
                  </div>
                </button>

                <button
                  onClick={handleEmail}
                  className="w-full flex items-center justify-start gap-4 p-4 border border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-slate-800">بريد إلكتروني</h4>
                    <p className="text-xs text-slate-500">للطلبات الرسمية والمرفقات</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
