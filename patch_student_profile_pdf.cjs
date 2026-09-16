const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// 1. Update handlePrint type
const handlePrintOld = `  const handlePrint = (data: any, type: 'solidarity' | 'activity') => {`;
const handlePrintNew = `  const handlePrint = (data: any, type: 'solidarity' | 'activity' | 'summary') => {`;
if (code.includes(handlePrintOld)) {
    code = code.replace(handlePrintOld, handlePrintNew);
} else {
    console.error("handlePrintOld not found");
}

// 2. Add Export Button inside the Digital ID card container section
const idCardOld = `              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIdCardModalOpen(true)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-xs font-semibold text-blue-200">بطاقة الطالب الرقمية</h3>
                  <span className="text-[10px] bg-blue-700/50 px-2 py-1 rounded text-blue-100 flex items-center gap-1">عرض الكارنيه</span>
                </div>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="font-bold text-lg leading-tight">{studentInfo.name}</p>
                    <p className="text-xs text-blue-200 mt-1">{studentInfo.major}</p>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=2021045678" alt="QR Code" className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>`;

const idCardNew = `              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIdCardModalOpen(true)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-xs font-semibold text-blue-200">بطاقة الطالب الرقمية</h3>
                  <span className="text-[10px] bg-blue-700/50 px-2 py-1 rounded text-blue-100 flex items-center gap-1">عرض الكارنيه</span>
                </div>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="font-bold text-lg leading-tight">{studentInfo.name}</p>
                    <p className="text-xs text-blue-200 mt-1">{studentInfo.major}</p>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=2021045678" alt="QR Code" className="w-12 h-12" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePrint({}, 'summary')}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 font-bold py-3 px-4 rounded-xl transition-all shadow-sm group"
              >
                <Printer className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                طباعة سجل الأنشطة والطلبات كـ PDF
              </button>
            </div>`;

if (code.includes(idCardOld)) {
    code = code.replace(idCardOld, idCardNew);
} else {
    console.error("idCardOld not found");
}

// 3. Update the Title in print layout
const printTitleOld = `{printData.documentType === 'solidarity' ? 'إفادة طلب تكافل اجتماعي' : 'إفادة نشاط طلابي'}`;
const printTitleNew = `{printData.documentType === 'solidarity' ? 'إفادة طلب تكافل اجتماعي' : printData.documentType === 'summary' ? 'سجل الأنشطة والطلبات الشامل' : 'إفادة نشاط طلابي'}`;

if (code.includes(printTitleOld)) {
    code = code.replace(printTitleOld, printTitleNew);
} else {
    console.error("printTitleOld not found");
}

// 4. Update the content block in print layout
const printContentOld = `            <h3 className="font-bold text-xl mb-6 border-b border-slate-200 pb-2">تفاصيل المستند</h3>
            {printData.documentType === 'solidarity' && (
              <div className="grid grid-cols-1 gap-y-6 text-lg">
                <div><span className="font-bold">نوع الطلب:</span> {printData.type}</div>
                <div><span className="font-bold">تاريخ التقديم:</span> {printData.date}</div>
                <div><span className="font-bold">الحالة الحالية:</span> {printData.status === 'disbursed' ? 'تم صرف المساعدة' : printData.status === 'approved' ? 'تم القبول (في انتظار الصرف)' : printData.status === 'under_review' ? 'قيد المراجعة' : 'تم الاستلام'}</div>
                <div><span className="font-bold">الرقم المرجعي للطلب:</span> #{printData.id}-{new Date().getFullYear()}</div>
              </div>
            )}`;

const printContentNew = `            <h3 className="font-bold text-xl mb-6 border-b border-slate-200 pb-2">تفاصيل المستند</h3>
            {printData.documentType === 'solidarity' && (
              <div className="grid grid-cols-1 gap-y-6 text-lg">
                <div><span className="font-bold">نوع الطلب:</span> {printData.type}</div>
                <div><span className="font-bold">تاريخ التقديم:</span> {printData.date}</div>
                <div><span className="font-bold">الحالة الحالية:</span> {printData.status === 'disbursed' ? 'تم صرف المساعدة' : printData.status === 'approved' ? 'تم القبول (في انتظار الصرف)' : printData.status === 'under_review' ? 'قيد المراجعة' : 'تم الاستلام'}</div>
                <div><span className="font-bold">الرقم المرجعي للطلب:</span> #{printData.id}-{new Date().getFullYear()}</div>
              </div>
            )}
            
            {printData.documentType === 'summary' && (
              <div className="space-y-10">
                <div>
                  <h4 className="font-bold text-lg mb-4 text-slate-800">الأنشطة والرحلات المسجلة</h4>
                  <table className="w-full text-right border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-3 font-bold">النشاط / الرحلة</th>
                        <th className="border border-slate-300 p-3 font-bold">التاريخ</th>
                        <th className="border border-slate-300 p-3 font-bold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...activityHistory, ...tripsHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(item => (
                        <tr key={item.id + item.title}>
                          <td className="border border-slate-300 p-3">{item.title}</td>
                          <td className="border border-slate-300 p-3">{item.date}</td>
                          <td className="border border-slate-300 p-3">
                            {item.status === 'completed' ? 'مكتمل' : 'مسجل'}
                          </td>
                        </tr>
                      ))}
                      {activityHistory.length === 0 && tripsHistory.length === 0 && (
                        <tr>
                          <td colSpan={3} className="border border-slate-300 p-3 text-center text-slate-500">لا يوجد سجل أنشطة أو رحلات.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4 text-slate-800">طلبات التكافل الاجتماعي</h4>
                  <table className="w-full text-right border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-3 font-bold">رقم الطلب</th>
                        <th className="border border-slate-300 p-3 font-bold">نوع الطلب</th>
                        <th className="border border-slate-300 p-3 font-bold">التاريخ</th>
                        <th className="border border-slate-300 p-3 font-bold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solidarityRequests.map(r => (
                        <tr key={r.id}>
                          <td className="border border-slate-300 p-3 text-left" dir="ltr">#{r.id}</td>
                          <td className="border border-slate-300 p-3">{r.type}</td>
                          <td className="border border-slate-300 p-3">{r.date}</td>
                          <td className="border border-slate-300 p-3">
                            {r.status === 'disbursed' ? 'تم الصرف' : r.status === 'approved' ? 'مقبول' : r.status === 'under_review' ? 'قيد المراجعة' : 'مستلم'}
                          </td>
                        </tr>
                      ))}
                      {solidarityRequests.length === 0 && (
                        <tr>
                          <td colSpan={4} className="border border-slate-300 p-3 text-center text-slate-500">لا توجد طلبات تكافل اجتماعي مسجلة.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}`;

if (code.includes(printContentOld)) {
    code = code.replace(printContentOld, printContentNew);
} else {
    console.error("printContentOld not found");
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
