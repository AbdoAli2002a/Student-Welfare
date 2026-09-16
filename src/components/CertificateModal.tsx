import React, { useRef, useState } from 'react';
import { X, Download, Award } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  activityName: string;
  date: string;
}

export default function CertificateModal({ isOpen, onClose, studentName, activityName, date }: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      // A4 format: 297mm x 210mm (landscape)
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate_${activityName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">شهادة إتمام نشاط</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow flex justify-center bg-slate-100">
          {/* Certificate Container to be captured */}
          <div 
            ref={certificateRef} 
            className="bg-white w-full max-w-[800px] aspect-[1.414/1] relative p-12 text-center flex flex-col justify-center items-center overflow-hidden"
            style={{ 
              backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f0f7ff 100%)',
              border: '16px solid #1e3a8a',
              outline: '2px solid #3b82f6',
              outlineOffset: '-24px'
            }}
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
            
            <div className="z-10 w-full">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              
              <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-2 tracking-tight">شهادة مشاركة</h1>
              <p className="text-lg text-blue-600 font-semibold mb-10 tracking-widest uppercase">Certificate of Participation</p>
              
              <p className="text-xl text-slate-700 mb-4">تشهد إدارة رعاية الطلاب بأن الطالب/ة:</p>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 pb-4 border-b-2 border-slate-200 w-3/4 mx-auto">
                {studentName}
              </h2>
              
              <p className="text-xl text-slate-700 mb-4">قد شارك بفعالية وأتم بنجاح نشاط:</p>
              
              <h3 className="text-2xl font-bold text-blue-800 mb-12">
                {activityName}
              </h3>
              
              <div className="flex justify-between w-full px-12 mt-auto">
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500 mb-2">التاريخ</p>
                  <p className="font-bold text-slate-800 border-t border-slate-300 pt-2 w-32">{date}</p>
                </div>
                
                <div className="w-24 h-24 border-4 border-blue-100 rounded-full flex items-center justify-center opacity-80 rotate-12">
                  <span className="text-blue-800 font-black text-xl transform -rotate-12">مُعتمد</span>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-500 mb-2">مدير الإدارة</p>
                  <p className="font-bold text-slate-800 border-t border-slate-300 pt-2 w-32" style={{ fontFamily: 'cursive' }}>توقيع معتمد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-75"
          >
            {isGenerating ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>{isGenerating ? 'جاري التحميل...' : 'تحميل كملف PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
