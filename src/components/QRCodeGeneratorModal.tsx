import React from 'react';
import { X, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  activityId: string;
}

export default function QRCodeGeneratorModal({ isOpen, onClose, activityName, activityId }: QRCodeGeneratorModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate a payload that the scanner will read (could just be the activity ID, or a JSON object)
  const qrPayload = JSON.stringify({ type: 'activity_attendance', activityId });

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity no-print" onClick={onClose}></div>
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-50 print:relative print:transform-none print:top-0 print:left-0 print:w-full print:shadow-none print:rounded-none" dir="rtl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 no-print">
          <h3 className="font-bold text-slate-800">
            رمز QR للحضور
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 text-center flex flex-col items-center">
          <h4 className="font-bold text-slate-900 text-xl mb-2">{activityName}</h4>
          <p className="text-slate-500 mb-8 no-print">قم بطباعة أو عرض هذا الرمز ليتمكن الطلاب من مسحه لتسجيل الحضور.</p>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8">
            <QRCodeSVG 
              value={qrPayload} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <button 
            onClick={handlePrint}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors py-3 rounded-xl font-bold no-print shadow-md"
          >
            <Printer className="w-5 h-5" />
            طباعة رمز QR
          </button>
        </div>
      </div>
    </>
  );
}
