import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, AlertCircle, Printer, Download, ChevronLeft, ChevronRight, User, FileText, ListChecks, Search, Clock, RefreshCcw, CheckCircle, HelpCircle, Activity } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function SolidarityForm() {
  const { showToast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    assistanceType: '',
    details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'يرجى إدخال الاسم الرباعي';
      else if (formData.name.trim().split(' ').length < 3) newErrors.name = 'يرجى إدخال الاسم ثلاثياً على الأقل';
      
      if (!formData.studentId.trim()) newErrors.studentId = 'يرجى إدخال الرقم الجامعي';
      else if (!/^\d+$/.test(formData.studentId)) newErrors.studentId = 'الرقم الجامعي يجب أن يحتوي على أرقام فقط';
    } else if (step === 2) {
      if (!formData.assistanceType) newErrors.assistanceType = 'يرجى تحديد نوع المساعدة المطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    if (!formData.name || !formData.studentId || !formData.assistanceType) {
      showToast?.('يرجى التأكد من تعبئة جميع الحقول المطلوبة', 'error');
      return;
    }
    
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
      pdf.save(`receipt_${formData.studentId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF', error);
      showToast?.('حدث خطأ أثناء تحميل الملف', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/solidarity-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('فشل إرسال الطلب');
      
      setIsSuccess(true);
      showToast?.('تم إرسال الطلب بنجاح', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setApiError('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm mt-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 print:hidden">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2 print:hidden">تم تسجيل طلبك بنجاح</h3>
        <p className="text-green-700 mb-6 print:hidden">
          لقد استلمنا طلب التكافل الاجتماعي الخاص بك. سيتم مراجعته من قبل اللجنة المختصة والتواصل معك قريباً.
        </p>

        {/* Printable Receipt */}
        <div ref={pdfRef} className="bg-white border border-green-100 rounded-lg p-8 mb-6 text-right shadow-sm print:shadow-none print:border-none print:p-0">
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6" dir="rtl">
            <div className="text-sm font-bold text-slate-800 space-y-1 text-right">
              <p>جامعة التربية النوعية</p>
              <p>إدارة رعاية الشباب</p>
              <p>قسم التكافل الاجتماعي</p>
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
              {/* Fallback Logo */}
              <img src="/logo2.png" alt="الشعار" className="w-full h-full object-contain p-1" />
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
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 print:hidden">
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
              setCurrentStep(1);
              setFormData({ name: '', studentId: '', assistanceType: '', details: '' });
            }}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
            تقديم طلب آخر
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'البيانات الشخصية', icon: User },
    { id: 2, label: 'تفاصيل المساعدة', icon: FileText },
    { id: 3, label: 'مراجعة وإرسال', icon: ListChecks }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto mt-8 text-right">
      
      <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'submit' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          تقديم طلب جديد
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'track' 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
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
                      <div className={`absolute right-0 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                        update.status === 'approved' ? 'bg-green-500 text-white' : 
                        update.status === 'under_review' ? 'bg-yellow-500 text-white' : 
                        update.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
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
        <h3 className="text-xl font-bold text-slate-800 mb-6">نموذج طلب المساعدة</h3>
        
        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full -z-10" dir="rtl">
            <div 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} 
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
            ></div>
          </div>
          <div className="flex justify-between relative z-10" dir="rtl">
            {steps.map(step => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className={`flex flex-col items-center gap-2 bg-white px-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-400'} ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-800' : 'text-slate-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                الاسم الرباعي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-shadow ${
                  errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="أدخل اسمك كاملاً كما في البطاقة"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-semibold text-slate-700 mb-2">
                الرقم الجامعي (رقم الكارنيه) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-shadow text-left ${
                  errors.studentId ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="مثال: 20230456"
                dir="ltr"
              />
              {errors.studentId && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.studentId}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label htmlFor="assistanceType" className="block text-sm font-semibold text-slate-700 mb-2">
                نوع المساعدة المطلوبة <span className="text-red-500">*</span>
              </label>
              <select
                id="assistanceType"
                name="assistanceType"
                required
                value={formData.assistanceType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-shadow ${
                  errors.assistanceType ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              >
                <option value="">-- اختر نوع المساعدة --</option>
                <option value="tuition">المساهمة في المصروفات الدراسية</option>
                <option value="books">توفير الكتب والمذكرات الجامعية</option>
                <option value="medical">مساعدة طبية / علاجية</option>
                <option value="other">أخرى (يرجى التوضيح في التفاصيل)</option>
              </select>
              {errors.assistanceType && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.assistanceType}</p>}
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-semibold text-slate-700 mb-2">
                تفاصيل إضافية (اختياري)
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-shadow resize-none"
                placeholder="أضف أي تفاصيل أخرى تساعدنا في دراسة حالتك..."
              ></textarea>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
              <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-600" />
                مراجعة البيانات المدخلة
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">الاسم الرباعي</span>
                  <span className="text-sm text-slate-900 font-bold">{formData.name}</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">الرقم الجامعي</span>
                  <span className="text-sm text-slate-900 font-bold">{formData.studentId}</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-100 shadow-sm sm:col-span-2">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">نوع المساعدة</span>
                  <span className="text-sm text-slate-900 font-bold">
                    {formData.assistanceType === 'tuition' ? 'المساهمة في المصروفات' :
                      formData.assistanceType === 'books' ? 'توفير الكتب' :
                      formData.assistanceType === 'medical' ? 'مساعدة طبية' : 'أخرى'}
                  </span>
                </div>
                {formData.details && (
                  <div className="bg-white p-3 rounded border border-slate-100 shadow-sm sm:col-span-2">
                    <span className="text-xs text-slate-500 font-semibold block mb-1">تفاصيل إضافية</span>
                    <p className="text-sm text-slate-900">{formData.details}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm flex items-start gap-3 border border-yellow-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                أتعهد بأن جميع البيانات المدخلة صحيحة، وفي حال ثبوت عكس ذلك، أتحمل المسئولية الكاملة ويحق للكلية اتخاذ الإجراءات اللازمة.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100" dir="rtl">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border border-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-900 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  تأكيد وإرسال
                </>
              )}
            </button>
          )}
        </div>
      </form>
      </>
      )}
    </div>
  );
}
