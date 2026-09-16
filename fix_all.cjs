const fs = require('fs');

// Fix StudentProfile.tsx
let profileCode = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// The file might still have useEffect with onAuthStateChanged and queries in it
// Let's just remove the imports from being called by commenting them out, or replacing the logic.
profileCode = profileCode.replace(/const unsubscribe = onAuthStateChanged[\s\S]*?return \(\) => unsubscribe\(\);\n  }, \[\]\);/g, "");
profileCode = profileCode.replace(/const q = query\(collection[\s\S]*?getDocs\(q\);/g, "");

fs.writeFileSync('src/components/StudentProfile.tsx', profileCode);

// Fix SolidarityForm.tsx
let formCode = fs.readFileSync('src/components/SolidarityForm.tsx', 'utf8');

const regexReceipt = /<div className="bg-white border border-green-100 rounded-lg p-6 mb-6 text-right shadow-sm print:shadow-none print:border-none print:p-0">[\s\S]*?<\/div>\s*<\/div>/;

const newReceipt = `<div ref={pdfRef} className="bg-white border border-green-100 rounded-lg p-8 mb-6 text-right shadow-sm">
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6" dir="rtl">
            <div className="text-sm font-bold text-slate-800 space-y-1 text-right">
              <p>جامعة التربية النوعية</p>
              <p>إدارة رعاية الشباب</p>
              <p>قسم التكافل الاجتماعي</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
              <div className="text-xs font-bold text-slate-400 text-center leading-tight">شعار<br/>الجامعة</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h4 className="text-xl font-bold text-slate-900 border-b inline-block pb-1">إيصال استلام طلب تكافل اجتماعي</h4>
          </div>
          
          <div className="space-y-5 text-slate-800 text-base" dir="rtl">
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
          
          <div className="mt-12 pt-8 flex justify-between text-base" dir="rtl">
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

formCode = formCode.replace(regexReceipt, newReceipt);
fs.writeFileSync('src/components/SolidarityForm.tsx', formCode);

