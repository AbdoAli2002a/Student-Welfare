const fs = require('fs');
let code = fs.readFileSync('src/components/SolidarityForm.tsx', 'utf8');

const importsOld = "import { Send, CheckCircle2, AlertCircle, Printer, Download, ChevronLeft, ChevronRight, User, FileText, ListChecks } from 'lucide-react';";
const importsNew = "import { Send, CheckCircle2, AlertCircle, Printer, Download, ChevronLeft, ChevronRight, User, FileText, ListChecks, Search, Clock, RefreshCcw, CheckCircle, HelpCircle, Activity } from 'lucide-react';";

if (code.includes(importsOld)) {
    code = code.replace(importsOld, importsNew);
} else {
    console.error("importsOld not found");
}

const statesOld = `  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');`;
const statesNew = `  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Mock tracking result
    setTrackingResult({
      id: trackingId,
      date: new Date().toLocaleDateString('ar-EG'),
      type: 'المساهمة في المصروفات الدراسية',
      status: 'under_review',
      updates: [
        { date: new Date(Date.now() - 86400000).toLocaleDateString('ar-EG'), status: 'pending', note: 'تم استلام الطلب وبانتظار المراجعة' },
        { date: new Date().toLocaleDateString('ar-EG'), status: 'under_review', note: 'الطلب قيد المراجعة من الأخصائي الاجتماعي' }
      ]
    });
  };

  const simulateAdminUpdate = () => {
    if (trackingResult && trackingResult.status !== 'approved') {
       const updatedResult = {
         ...trackingResult,
         status: 'approved',
         updates: [
           ...trackingResult.updates,
           { date: new Date().toLocaleDateString('ar-EG'), status: 'approved', note: 'تمت الموافقة على الطلب بنجاح. يرجى التوجه للإدارة لاستكمال الإجراءات.' }
         ]
       };
       setTrackingResult(updatedResult);
       showToast?.('إشعار ذكي: تم تحديث حالة طلبك إلى "مقبول"', 'success');
       
       if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('تحديث حالة طلب التكافل', {
               body: 'تمت الموافقة على طلبك. يرجى مراجعة التفاصيل.',
               icon: '/vite.svg',
               dir: 'rtl'
            });
          } catch(e) { console.error('Notification error', e); }
       }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> تم الاستلام</span>;
      case 'under_review': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><RefreshCcw className="w-3 h-3 animate-spin-slow" /> قيد المراجعة</span>;
      case 'approved': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> مقبول</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> مرفوض</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">غير معروف</span>;
    }
  };`;

if (code.includes(statesOld)) {
    code = code.replace(statesOld, statesNew);
} else {
    console.error("statesOld not found");
}

const renderOld = `  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto mt-8 text-right">
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">نموذج طلب المساعدة</h3>`;
const renderNew = `  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto mt-8 text-right">
      
      <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('submit')}
          className={\`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all \${
            activeTab === 'submit' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }\`}
        >
          تقديم طلب جديد
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={\`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all \${
            activeTab === 'track' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }\`}
        >
          تتبع حالة الطلب
        </button>
      </div>

      {activeTab === 'track' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">استعلام عن حالة الطلب</h3>
            <p className="text-sm text-slate-500">أدخل رقم الطلب أو الرقم الجامعي لمعرفة حالة طلبك الحالي.</p>
          </div>
          
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="رقم الطلب أو الرقم الجامعي..."
              className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-shadow"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">استعلام</span>
            </button>
          </form>

          {trackingResult && (
            <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">طلب رقم #{trackingResult.id}</p>
                  <h4 className="font-bold text-slate-900 text-lg">{trackingResult.type}</h4>
                </div>
                <div>{getStatusBadge(trackingResult.status)}</div>
              </div>
              
              <div className="p-5 space-y-6">
                <div className="relative">
                  <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                  
                  {trackingResult.updates.map((update: any, idx: number) => (
                    <div key={idx} className="relative pl-4 pr-10 mb-6 last:mb-0">
                      <div className={\`absolute right-0 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm \${
                        update.status === 'approved' ? 'bg-green-500 text-white' : 
                        update.status === 'under_review' ? 'bg-yellow-500 text-white' : 
                        update.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }\`}>
                        {update.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                         update.status === 'under_review' ? <RefreshCcw className="w-3 h-3" /> :
                         update.status === 'rejected' ? <AlertCircle className="w-3 h-3" /> :
                         <Clock className="w-3 h-3" />}
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-xs font-bold text-slate-400 block mb-1">{update.date}</span>
                        <p className="text-sm font-semibold text-slate-800">{update.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {trackingResult.status === 'under_review' && (
                  <div className="pt-4 border-t border-slate-200 flex justify-center">
                    <button 
                      onClick={simulateAdminUpdate}
                      className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      محاكاة تحديث حالة الطلب من قِبل الإدارة
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">نموذج طلب المساعدة</h3>`;

if (code.includes(renderOld)) {
    code = code.replace(renderOld, renderNew);
} else {
    console.error("renderOld not found");
}

const formEndOld = `        </div>
      </form>
    </div>
  );
}`;
const formEndNew = `        </div>
      </form>
      </>
      )}
    </div>
  );
}`;

if (code.includes(formEndOld)) {
    code = code.replace(formEndOld, formEndNew);
} else {
    console.error("formEndOld not found");
}

fs.writeFileSync('src/components/SolidarityForm.tsx', code);
