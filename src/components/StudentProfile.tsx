import React, { useState, useEffect } from 'react';
import { User, Book, MapPin, Hash, CheckCircle, Clock, Calendar, Award, Star, FileText, MessageSquare, Printer, Download, ArrowRight, Wallet, Check, ListTodo, Plus, Trash2 } from 'lucide-react';

import { useToast } from '../contexts/ToastContext';
import SurveyModal from './SurveyModal';
import CertificateModal from './CertificateModal';
import DigitalIdCardModal from './DigitalIdCardModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentProfile() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'activities' | 'trips' | 'solidarity' | 'history'>('activities');
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [printData, setPrintData] = useState<any>(null);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintData(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = (data: any, type: 'solidarity' | 'activity' | 'summary') => {
    setPrintData({ ...data, documentType: type });
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const [selectedCertificate, setSelectedCertificate] = useState<{title: string, date: string} | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<{id: number, type: 'activity' | 'trip', title: string} | null>(null);
  
    const [todos, setTodos] = useState<{id: number, text: string, completed: boolean}[]>([
    { id: 1, text: 'تسليم استمارة التكافل الاجتماعي', completed: false },
    { id: 2, text: 'دفع رسوم رحلة الأقصر', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), text: newTodo.trim(), completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const [interests, setInterests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('student_interests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleInterest = (id: string) => {
    setInterests(prev => {
      const newInterests = prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id];
      localStorage.setItem('student_interests', JSON.stringify(newInterests));
      // Dispatch custom event so ActivitiesList can listen to it if needed (though local storage might be enough if reloading or reading on mount)
      window.dispatchEvent(new Event('interestsUpdated'));
      return newInterests;
    });
  };

  const [studentInfo, setStudentInfo] = useState({
    name: 'جاري التحميل...',
    year: '',
    major: 'طالب',
    id: '',
    gpa: '-',
    email: ''
  });

    const attendanceData = [
    { name: 'الرياضية', student: 5, average: 3 },
    { name: 'الفنية', student: 2, average: 4 },
    { name: 'الثقافية', student: 4, average: 2 },
    { name: 'الاجتماعية', student: 3, average: 3.5 },
    { name: 'الجوالة', student: 1, average: 2 },
  ];

  const [activityHistory, setActivityHistory] = useState([
    { id: 1, title: 'معرض الفنون التشكيلية', date: '١٢ أكتوبر ٢٠٢٣', status: 'completed', type: 'اللجنة الفنية', rating: 5, hasCertificate: true },
    { id: 2, title: 'مسابقة الشطرنج السنوية', date: '٥ نوفمبر ٢٠٢٣', status: 'completed', type: 'اللجنة الرياضية', rating: undefined, hasCertificate: false },
    { id: 3, title: 'حملة التبرع بالدم', date: '٢٠ نوفمبر ٢٠٢٣', status: 'upcoming', type: 'لجنة الجوالة والخدمة العامة' }
  ]);

  const [tripsHistory, setTripsHistory] = useState([
    { id: 1, title: 'رحلة مدينة الأقصر وأسوان', date: '٢٥ يناير ٢٠٢٣', status: 'completed', rating: 5, hasCertificate: true },
    { id: 2, title: 'معسكر إعداد القادة', date: '١٥ يوليو ٢٠٢٣', status: 'completed', rating: undefined, hasCertificate: true }
  ]);

  const [solidarityRequests, setSolidarityRequests] = useState([
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
  };

  const handleOpenSurvey = (id: number, type: 'activity' | 'trip', title: string) => {
    setSelectedActivity({ id, type, title });
    setSurveyModalOpen(true);
  };

  const handleSurveySubmit = (rating: number, feedback: string) => {
    if (!selectedActivity) return;
    
    if (selectedActivity.type === 'activity') {
      setActivityHistory(activityHistory.map(activity => 
        activity.id === selectedActivity.id ? { ...activity, rating } : activity
      ));
    } else {
      setTripsHistory(tripsHistory.map(trip => 
        trip.id === selectedActivity.id ? { ...trip, rating } : trip
      ));
    }
    setSurveyModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            {/* Header / Cover */}
            <div className="h-32 bg-blue-900 relative">
              <div className="absolute -bottom-12 right-6">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            </div>
            
            {/* Info */}
            <div className="pt-16 pb-6 px-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{studentInfo.name}</h2>
              <p className="text-sm text-slate-500 mb-6">{studentInfo.email}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                    <Book className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">الفرقة / التخصص</p>
                    <p className="font-semibold text-slate-800">{studentInfo.year} - {studentInfo.major}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">رقم الكارنيه الجامعي</p>
                    <p className="font-semibold text-slate-800 font-mono">{studentInfo.id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Digital ID Card visualization */}
            <div className="px-6 pb-6 pt-2">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIdCardModalOpen(true)}>
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
            </div>
            
            {/* Interests Section */}
            <div className="px-6 pb-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-800 mb-3">الاهتمامات (لتخصيص الاقتراحات)</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'artistic', label: 'النشاط الفني' },
                  { id: 'sports', label: 'النشاط الرياضي' },
                  { id: 'cultural', label: 'النشاط الثقافي' },
                  { id: 'scouting', label: 'الجوالة' },
                ].map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      interests.includes(interest.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* To-Do List Section */}
            <div className="px-6 pb-6 border-t border-slate-100 pt-6 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                قائمة المهام
              </h3>
              
              <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="أضف مهمة جديدة..."
                  className="flex-grow px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button 
                  type="submit"
                  disabled={!newTodo.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {todos.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">لا توجد مهام حالياً</p>
                ) : (
                  todos.map(todo => (
                    <div 
                      key={todo.id} 
                      className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border ${todo.completed ? 'bg-slate-100 border-slate-100' : 'bg-white border-slate-200 shadow-sm'} transition-colors`}
                    >
                      <div className="flex items-start gap-2 overflow-hidden">
                        <button 
                          onClick={() => toggleTodo(todo.id)}
                          className={`shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded border transition-colors ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-blue-400'}`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <span className={`text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {todo.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex gap-6 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('activities')}
                className={`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'activities' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                سجل الأنشطة والفعاليات
              </button>
              <button 
                onClick={() => setActiveTab('trips')}
                className={`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'trips' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                سجل الرحلات
              </button>
              <button 
                onClick={() => setActiveTab('solidarity')}
                className={`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'solidarity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                طلبات التكافل الاجتماعي
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                سجل النشاط
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'activities' ? (
                <div className="space-y-6">
                  {/* Attendance Chart */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      معدل حضورك للأنشطة مقارنة بمتوسط الطلاب
                    </h4>
                    <div className="h-64 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="student" name="حضورك" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                          <Bar dataKey="average" name="متوسط الكلية" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                  {activityHistory.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className={`p-3 rounded-full ${activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {activity.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{activity.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {activity.status === 'completed' ? 'تمت المشاركة' : 'مسجل حالياً'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {activity.date} • {activity.type}
                        </p>
                        
                        {activity.status === 'completed' && (
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {activity.rating === undefined ? (
                              <button
                                onClick={() => handleOpenSurvey(activity.id, 'activity', activity.title)}
                                className="text-xs font-bold bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                قيّم النشاط
                              </button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-slate-600 ml-1">تقييمك:</span>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} className={`w-3 h-3 ${star <= activity.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                ))}
                              </div>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedCertificate({ title: activity.title, date: activity.date });
                                setCertificateModalOpen(true);
                              }}
                              className="text-xs font-bold bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors mr-auto"
                            >
                              <Award className="w-3 h-3" />
                              عرض الشهادة
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              ) : activeTab === 'trips' ? (
                <div className="space-y-4">
                  {tripsHistory.map(trip => (
                    <div key={trip.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{trip.title}</h4>
                          <span className="text-xs px-2 py-1 rounded font-semibold bg-green-100 text-green-700">
                            تمت المشاركة
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {trip.date}
                        </p>
                        
                        {trip.status === 'completed' && (
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            {trip.rating === undefined ? (
                              <button
                                onClick={() => handleOpenSurvey(trip.id, 'trip', trip.title)}
                                className="text-xs font-bold bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                قيّم الرحلة
                              </button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-slate-600 ml-1">تقييمك:</span>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} className={`w-3 h-3 ${star <= trip.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setSelectedCertificate({ title: trip.title, date: trip.date });
                                setCertificateModalOpen(true);
                              }}
                              className="text-xs font-bold bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded flex items-center gap-1 transition-colors mr-auto"
                            >
                              <Award className="w-3 h-3" />
                              عرض الشهادة
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'history' ? (
                <div className="space-y-4">
                  {[
                    ...activityHistory.filter(a => a.status === 'completed').map(a => ({...a, category: 'نشاط', icon: <CheckCircle className="w-6 h-6" />})),
                    ...tripsHistory.filter(t => t.status === 'completed').map(t => ({...t, category: 'رحلة', icon: <MapPin className="w-6 h-6" />}))
                  ].map((item, idx) => (
                    <div key={`hist-${idx}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4 flex-grow w-full">
                        <div className="p-3 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <span className="text-xs px-2 py-1 rounded font-semibold bg-slate-200 text-slate-700 sm:hidden">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {item.date}
                            {item.type && <span>• {item.type}</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-200">
                        <span className="text-xs px-2 py-1 rounded font-semibold bg-slate-200 text-slate-700 hidden sm:block">
                          {item.category}
                        </span>
                        {item.hasCertificate && (
                          <button 
                            onClick={() => {
                              setSelectedCertificate({ title: item.title, date: item.date });
                              setCertificateModalOpen(true);
                            }}
                            className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                            عرض الشهادة
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {activityHistory.filter(a => a.status === 'completed').length === 0 && tripsHistory.filter(t => t.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة أو رحلات سابقة</div>
                  )}
                </div>
              ) : (
                <div className="space-y-0 relative before:hidden sm:before:block before:absolute before:right-[15px] before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200 before:z-0">
                  {solidarityRequests.map((request, index) => {
                    const stepIndex = getStepIndex(request.status);
                    const isCompleted = stepIndex >= 3;
                    
                    return (
                    <div key={request.id} className="flex gap-4 sm:gap-6 relative z-10 mb-8 last:mb-0">
                      {/* Timeline Dot (Hidden on small screens for better space, visible on SM+) */}
                      <div className="hidden sm:flex flex-col items-center pt-6">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} ring-4 ring-slate-50 shadow-sm z-10`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="flex-1">
                        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                          {/* Decorative Timeline Edge on Mobile */}
                          <div className={`sm:hidden absolute top-0 right-0 w-1 h-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${
                            stepIndex >= 3 ? 'bg-green-100 text-green-600' : 
                            stepIndex >= 2 ? 'bg-emerald-100 text-emerald-600' : 
                            stepIndex >= 1 ? 'bg-yellow-100 text-yellow-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
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
                            onClick={() => handlePrint(request, 'solidarity')}
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
                          style={{ width: `${(stepIndex / 3) * 100}%` }}
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                                  isCompleted 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                    : 'bg-white border-slate-200 text-slate-400'
                                }`}>
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-bold ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
      

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
              {printData.documentType === 'solidarity' ? 'إفادة طلب تكافل اجتماعي' : printData.documentType === 'summary' ? 'سجل الأنشطة والطلبات الشامل' : 'إفادة نشاط طلابي'}
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
      <style>{printData ? `@media print { .no-print-when-active { display: none !important; } }` : ''}</style>
      
      {selectedActivity && (
        <SurveyModal 
          isOpen={surveyModalOpen}
          onClose={() => setSurveyModalOpen(false)}
          activityName={selectedActivity.title}
          onSubmit={handleSurveySubmit}
        />
      )}
      
      {selectedCertificate && (
        <CertificateModal
          isOpen={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          studentName={studentInfo.name}
          activityName={selectedCertificate.title}
          date={selectedCertificate.date}
        />
      )}
      <DigitalIdCardModal
        isOpen={idCardModalOpen}
        onClose={() => setIdCardModalOpen(false)}
        studentInfo={studentInfo}
      />
    </div>
  );
}
