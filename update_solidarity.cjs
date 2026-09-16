const fs = require('fs');
let code = fs.readFileSync('src/components/SolidarityForm.tsx', 'utf8');

// Add imports
code = code.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useRef } from 'react';\nimport html2canvas from 'html2canvas';\nimport jsPDF from 'jspdf';\nimport { Download } from 'lucide-react';"
);

// Add pdfRef and handleDownloadPDF
const refCode = `
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    // Temporarily show hidden print elements for the PDF
    const el = pdfRef.current;
    
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`receipt_\${formData.studentId}.pdf\`);
      
    } catch (error) {
      console.error('Error generating PDF', error);
      showToast?.('حدث خطأ أثناء تحميل الملف', 'error');
    }
  };
`;

code = code.replace(
  "const [apiError, setApiError] = useState('');",
  "const [apiError, setApiError] = useState('');\n" + refCode
);

// Replace the receipt section
const oldReceipt = `<div className="bg-white border border-green-100 rounded-lg p-6 mb-6 text-right shadow-sm print:shadow-none print:border-none print:p-0">
          <div className="border-b pb-4 mb-4">
            <h4 className="text-lg font-bold text-slate-800">إيصال تقديم طلب تكافل اجتماعي</h4>
            <p className="text-sm text-slate-500 print:hidden">يرجى طباعة هذا الإيصال والاحتفاظ به للمراجعة</p>
          </div>
          
          <div className="space-y-4 text-slate-700 text-sm sm:text-base">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="font-bold text-slate-500">الاسم الرباعي:</span>
              <span className="font-semibold text-slate-900">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="font-bold text-slate-500">الرقم الجامعي:</span>
              <span className="font-semibold text-slate-900">{formData.studentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="font-bold text-slate-500">نوع المساعدة:</span>
              <span className="font-semibold text-slate-900">
                {formData.assistanceType === 'tuition' ? 'المساهمة في المصروفات' :
                  formData.assistanceType === 'books' ? 'توفير الكتب' :
                  formData.assistanceType === 'medical' ? 'مساعدة طبية' : 'أخرى'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="font-bold text-slate-500">تاريخ التقديم:</span>
              <span className="font-semibold text-slate-900">{new Date().toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dashed border-slate-300 hidden print:flex justify-between text-sm">
            <p className="font-bold">توقيع الطالب: ...........................</p>
            <p className="font-bold">توقيع الموظف المختص: ...........................</p>
          </div>
        </div>`;

const newReceipt = `<div ref={pdfRef} className="bg-white border border-green-100 rounded-lg p-8 mb-6 text-right shadow-sm">
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
            <div className="text-sm font-bold text-slate-800 space-y-1">
              <p>جامعة التربية النوعية</p>
              <p>إدارة رعاية الشباب</p>
              <p>قسم التكافل الاجتماعي</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden">
              {/* Fallback Logo / Emblem */}
              <div className="text-xs font-bold text-slate-400 text-center leading-tight">شعار<br/>الجامعة</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-slate-900 border-b inline-block pb-1">إيصال استلام طلب تكافل اجتماعي</h4>
          </div>
          
          <div className="space-y-5 text-slate-800 text-base">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-600">الاسم الرباعي:</span>
              <span className="font-bold">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-600">الرقم الجامعي:</span>
              <span className="font-bold">{formData.studentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-600">نوع المساعدة:</span>
              <span className="font-bold">
                {formData.assistanceType === 'tuition' ? 'المساهمة في المصروفات' :
                  formData.assistanceType === 'books' ? 'توفير الكتب' :
                  formData.assistanceType === 'medical' ? 'مساعدة طبية' : 'أخرى'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-600">تاريخ التقديم:</span>
              <span className="font-bold">{new Date().toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 flex justify-between text-base">
            <div className="text-center">
              <p className="font-bold text-slate-700 mb-4">توقيع الطالب</p>
              <p className="text-slate-400">...........................</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700 mb-4">توقيع الموظف المختص</p>
              <p className="text-slate-400">...........................</p>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">هذا الإيصال يعتبر مستند إثبات لتقديم الطلب فقط، ولا يعتبر قبولاً نهائياً إلا بعد موافقة اللجنة المختصة.</p>
          </div>
        </div>`;

code = code.replace(oldReceipt, newReceipt);

// Update buttons
const oldButtons = `<div className="flex flex-col sm:flex-row justify-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            طباعة الإيصال
          </button>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', studentId: '', assistanceType: '', details: '' });
            }}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            تقديم طلب آخر
          </button>
        </div>`;

const newButtons = `<div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            تحميل PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            طباعة مباشرة
          </button>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', studentId: '', assistanceType: '', details: '' });
            }}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            تقديم طلب آخر
          </button>
        </div>`;

code = code.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/SolidarityForm.tsx', code);
