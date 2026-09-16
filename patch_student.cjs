const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

code = code.replace(
  "import { User, Book, MapPin, Hash, CheckCircle, Clock, Calendar, Award, Star, FileText, MessageSquare, Printer, Download } from 'lucide-react';",
  "import { User, Book, MapPin, Hash, CheckCircle, Clock, Calendar, Award, Star, FileText, MessageSquare, Printer, Download, ArrowRight, Wallet, Check } from 'lucide-react';\nimport { useToast } from '../contexts/ToastContext';"
);

code = code.replace(
  "export default function StudentProfile() {",
  "export default function StudentProfile() {\n  const { addToast } = useToast();"
);

code = code.replace(
  `  const solidarityRequests = [
    { id: 1, type: 'المساهمة في المصروفات الدراسية', date: '١٥ أكتوبر ٢٠٢٣', status: 'accepted' },
    { id: 2, type: 'توفير الكتب والمذكرات الجامعية', date: '٢٠ نوفمبر ٢٠٢٣', status: 'under_review' },
    { id: 3, type: 'مساعدة طبية', date: '٥ ديسمبر ٢٠٢٣', status: 'received' },
  ];`,
  `  const [solidarityRequests, setSolidarityRequests] = useState([
    { id: 1, type: 'المساهمة في المصروفات الدراسية', date: '١٥ أكتوبر ٢٠٢٣', status: 'accepted' },
    { id: 2, type: 'توفير الكتب والمذكرات الجامعية', date: '٢٠ نوفمبر ٢٠٢٣', status: 'under_review' },
    { id: 3, type: 'مساعدة طبية', date: '٥ ديسمبر ٢٠٢٣', status: 'received' },
  ]);

  const simulateProgress = (id: number) => {
    setSolidarityRequests(prev => prev.map(req => {
      if (req.id === id) {
        let nextStatus = req.status;
        let message = '';
        if (req.status === 'received') {
          nextStatus = 'under_review';
          message = 'طلبك الآن قيد المراجعة من قبل المختصين';
        } else if (req.status === 'under_review') {
          nextStatus = 'accepted';
          message = 'تم قبول طلبك بنجاح، بانتظار صرف المساعدة';
        } else if (req.status === 'accepted') {
          nextStatus = 'disbursed';
          message = 'تم صرف المساعدة لحسابك بنجاح';
        } else {
          return req;
        }
        
        addToast(message, 'success');
        return { ...req, status: nextStatus };
      }
      return req;
    }));
  };
  
  const getStepIndex = (status: string) => {
    switch(status) {
      case 'received': return 0;
      case 'under_review': return 1;
      case 'accepted': return 2;
      case 'disbursed': return 3;
      default: return 0;
    }
  };`
);

const searchJSX = `              ) : (
                <div className="space-y-4">
                  {solidarityRequests.map(request => (
                    <div key={request.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className={\`p-3 rounded-full \${
                        request.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                        request.status === 'under_review' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-blue-100 text-blue-600'
                      }\`}>
                        {request.status === 'accepted' ? <CheckCircle className="w-6 h-6" /> : 
                         request.status === 'under_review' ? <Clock className="w-6 h-6" /> : 
                         <FileText className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <h4 className="font-bold text-slate-900">{request.type}</h4>
                          <span className={\`text-xs px-2 py-1 rounded font-semibold whitespace-nowrap \${
                            request.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                            request.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-blue-100 text-blue-700'
                          }\`}>
                            {request.status === 'accepted' ? 'تم القبول' : 
                             request.status === 'under_review' ? 'قيد المراجعة' : 
                             'تم الاستلام'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> تاريخ التقديم: {request.date}
                          </p>
                          <button
                            onClick={() => window.print()}
                            className="text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            طباعة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}`;

const replaceJSX = `              ) : (
                <div className="space-y-6">
                  {solidarityRequests.map(request => {
                    const stepIndex = getStepIndex(request.status);
                    
                    return (
                    <div key={request.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={\`p-3 rounded-xl \${
                            stepIndex >= 3 ? 'bg-green-100 text-green-600' : 
                            stepIndex >= 2 ? 'bg-emerald-100 text-emerald-600' : 
                            stepIndex >= 1 ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-blue-100 text-blue-600'
                          }\`}>
                            {stepIndex >= 3 ? <Wallet className="w-6 h-6" /> : 
                             stepIndex >= 2 ? <CheckCircle className="w-6 h-6" /> : 
                             stepIndex >= 1 ? <Clock className="w-6 h-6" /> : 
                             <FileText className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{request.type}</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-3.5 h-3.5" /> تاريخ التقديم: {request.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status !== 'disbursed' && (
                            <button
                              onClick={() => simulateProgress(request.id)}
                              className="text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              تحديث الحالة (محاكاة)
                            </button>
                          )}
                          <button
                            onClick={() => window.print()}
                            className="text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            طباعة الإيصال
                          </button>
                        </div>
                      </div>
                      
                      {/* Stepper Progress */}
                      <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
                        <div 
                          className="absolute top-1/2 right-0 h-1 bg-blue-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-in-out" 
                          style={{ width: \`\${(stepIndex / 3) * 100}%\` }}
                        ></div>
                        
                        <div className="relative z-10 flex justify-between">
                          {[
                            { label: 'تم الاستلام', icon: FileText },
                            { label: 'قيد المراجعة', icon: Clock },
                            { label: 'تم القبول', icon: Check },
                            { label: 'صرف المساعدة', icon: Wallet },
                          ].map((step, idx) => {
                            const isCompleted = stepIndex >= idx;
                            const isCurrent = stepIndex === idx;
                            const StepIcon = step.icon;
                            
                            return (
                              <div key={idx} className="flex flex-col items-center gap-2">
                                <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 \${
                                  isCompleted 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                    : 'bg-white border-slate-200 text-slate-400'
                                }\`}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={\`text-xs font-bold \${isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}\`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}`;

code = code.replace(searchJSX, replaceJSX);

fs.writeFileSync('src/components/StudentProfile.tsx', code);
