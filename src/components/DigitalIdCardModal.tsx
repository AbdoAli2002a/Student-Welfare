import React, { useRef, useState } from 'react';
import { X, Download, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

interface DigitalIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentInfo: {
    name: string;
    id: string;
    email: string;
    year: string;
    major: string;
  };
}

export default function DigitalIdCardModal({ isOpen, onClose, studentInfo }: DigitalIdCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = `digital-id-${studentInfo.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const qrData = JSON.stringify({
    name: studentInfo.name,
    id: studentInfo.id,
    major: studentInfo.major
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-sans" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">الكارنيه الرقمي</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:bg-slate-200 hover:text-slate-600 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center">
          {/* ID Card Wrapper for Capture */}
          <div 
            ref={cardRef} 
            className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl shadow-xl overflow-hidden relative"
            style={{ minHeight: '400px' }}
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            
            {/* Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 className="text-white font-bold text-lg">جامعة المستقبل</h4>
                <p className="text-blue-200 text-xs mt-0.5">عمادة شئون الطلاب</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold font-serif text-xl">ج</span>
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 px-6 py-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-slate-100 flex items-center justify-center shadow-inner mb-4 overflow-hidden">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{studentInfo.name}</h2>
              <p className="text-blue-200 text-sm mb-4">{studentInfo.major}</p>

              <div className="bg-white p-3 rounded-xl shadow-sm mb-2">
                <QRCodeSVG 
                  value={qrData}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-white/60 text-[10px] font-mono tracking-widest mt-2">{studentInfo.id}</p>
            </div>
            
            {/* Footer */}
            <div className="relative z-10 bg-black/20 w-full py-3 px-6 flex justify-between items-center">
              <span className="text-white/80 text-xs font-semibold">{studentInfo.year}</span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> مقيد
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-center">
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">جاري التحميل...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                تحميل الكارنيه الرقمي
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
