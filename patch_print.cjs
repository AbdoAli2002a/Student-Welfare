const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// 1. Add state and effect
const stateInsert = `  const [idCardModalOpen, setIdCardModalOpen] = useState(false);`;
const stateCode = `  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [printData, setPrintData] = useState<any>(null);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintData(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = (data: any, type: 'solidarity' | 'activity') => {
    setPrintData({ ...data, documentType: type });
    setTimeout(() => {
      window.print();
    }, 200);
  };
`;

if (code.includes(stateInsert) && !code.includes('setPrintData')) {
    code = code.replace(stateInsert, stateCode);
}

// 2. Replace window.print()
const printBtnOld = `onClick={() => window.print()}`;
const printBtnNew = `onClick={() => handlePrint(request, 'solidarity')}`;

if (code.includes(printBtnOld)) {
    code = code.replace(printBtnOld, printBtnNew);
}

// 3. Add print layout at the end of the component, just before the modals
const modalStartOld = `      {selectedActivity && (`;
const printLayoutCode = `
      {/* Formal Print Document (Hidden on screen, visible only on print) */}
      {printData && (
        <div className="hidden print:flex fixed inset-0 bg-white z-[9999] flex-col p-10 print-text-black w-full min-h-screen">
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
            <div className="text-right">
              <h1 className="font-bold text-2xl mb-1">جامعة المستقبل</h1>
              <h2 className="font-semibold text-lg mb-1">إدارة رعاية الشباب</h2>
              <h3 className="text-sm">قسم التكافل والأنشطة</h3>
            </div>
            <div className="w-24 h-24 border-2 border-slate-300 rounded-full flex items-center justify-center bg-slate-50">
              <span className="text-xs font-bold text-slate-400">شعار الجامعة</span>
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold underline underline-offset-8">
              {printData.documentType === 'solidarity' ? 'إفادة طلب تكافل اجتماعي' : 'إفادة نشاط طلابي'}
            </h2>
            <p className="mt-4 text-lg">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
          </div>

          <div className="mb-10 p-6 border border-slate-300 rounded-lg">
            <h3 className="font-bold text-xl mb-6 border-b border-slate-200 pb-2">بيانات الطالب</h3>
            <div className="grid grid-cols-2 gap-y-6 text-lg">
              <div><span className="font-bold">الاسم:</span> {studentInfo.name}</div>
              <div><span className="font-bold">الرقم الجامعي:</span> {studentInfo.id}</div>
              <div><span className="font-bold">الكلية:</span> {studentInfo.faculty}</div>
              <div><span className="font-bold">الفرقة:</span> {studentInfo.year}</div>
            </div>
          </div>

          <div className="mb-12 p-6 border border-slate-300 rounded-lg flex-grow">
            <h3 className="font-bold text-xl mb-6 border-b border-slate-200 pb-2">تفاصيل المستند</h3>
            {printData.documentType === 'solidarity' && (
              <div className="grid grid-cols-1 gap-y-6 text-lg">
                <div><span className="font-bold">نوع الطلب:</span> {printData.type}</div>
                <div><span className="font-bold">تاريخ التقديم:</span> {printData.date}</div>
                <div><span className="font-bold">الحالة الحالية:</span> {printData.status === 'disbursed' ? 'تم صرف المساعدة' : printData.status === 'approved' ? 'تم القبول (في انتظار الصرف)' : printData.status === 'under_review' ? 'قيد المراجعة' : 'تم الاستلام'}</div>
                <div><span className="font-bold">الرقم المرجعي للطلب:</span> #{printData.id}-{new Date().getFullYear()}</div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-800">
            <div className="text-center">
              <p className="font-bold mb-8 text-lg">توقيع الموظف المختص</p>
              <p>.......................................</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-8 text-lg">ختم الإدارة (شعار الجمهورية)</p>
              <p>.......................................</p>
            </div>
          </div>
        </div>
      )}

      {/* Hide the main app layout during print when a document is being printed */}
      <style>{printData ? \`@media print { .no-print-when-active { display: none !important; } }\` : ''}</style>
      
      {selectedActivity && (`;

if (code.includes(modalStartOld)) {
    code = code.replace(modalStartOld, printLayoutCode);
} else {
    console.error("modalStartOld not found");
}

// 4. Add 'no-print-when-active' to the main wrapper
const mainWrapperOld = `<div className="max-w-7xl mx-auto">`;
const mainWrapperNew = `<div className="max-w-7xl mx-auto no-print-when-active">`;

if (code.includes(mainWrapperOld)) {
    code = code.replace(mainWrapperOld, mainWrapperNew);
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
