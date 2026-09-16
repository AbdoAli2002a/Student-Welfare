import React, { useEffect, useState } from 'react';
import { SolidarityRequest } from '../types';
import { CheckCircle, XCircle, Clock, Search, Shield, Users, FileText, Download, Menu, Image as ImageIcon, Calendar, Settings, Map, Vote, Bell, MessageSquare, UserPlus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import ActivityManagement from './ActivityManagement';
import TripManagement from './TripManagement';
import ElectionsManagement from './ElectionsManagement';
import FeedbackManagement from './FeedbackManagement';
import StudentAccounts from './StudentAccounts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('accounts'); // 'overview', 'content', 'trips', 'elections', 'solidarity', 'feedback', 'accounts', 'roles', 'notifications'
  const [currentRole, setCurrentRole] = useState('director'); // 'director', 'solidarity_admin', 'sports_admin'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [requests, setRequests] = useState<SolidarityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/solidarity-requests');
      if (!response.ok) throw new Error('فشل في تحميل الطلبات');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/solidarity-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('فشل في تحديث حالة الطلب');
      
      const { request } = await response.json();
      
      setRequests(prev => prev.map(req => req.id === id ? request : req));
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToExcel = () => {
    // Generate CSV data (with BOM for UTF-8 Excel support)
    const headers = ['الرقم التعريفي', 'اسم الطالب', 'الرقم الجامعي', 'تاريخ التقديم', 'نوع المساعدة', 'الحالة'];
    
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    filteredRequests.forEach(req => {
      const statusText = req.status === 'approved' ? 'مقبول' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة';
      const typeText = getAssistanceTypeLabel(req.assistanceType);
      const dateText = new Date(req.submittedAt).toLocaleDateString('ar-EG');
      
      const values = [
        `"${req.id}"`,
        `"${req.name}"`,
        `"${req.studentId}"`,
        `"${dateText}"`,
        `"${typeText}"`,
        `"${statusText}"`
      ];
      csvRows.push(values.join(','));
    });
    
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'solidarity_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRequests = requests.filter(req => 
    req.name.includes(searchTerm) || req.studentId.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle className="w-3.5 h-3.5"/> مقبول</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle className="w-3.5 h-3.5"/> مرفوض</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700"><Clock className="w-3.5 h-3.5"/> قيد المراجعة</span>;
    }
  };

  const getAssistanceTypeLabel = (type: string) => {
    switch(type) {
      case 'tuition': return 'المصروفات الدراسية';
      case 'books': return 'توفير الكتب';
      case 'medical': return 'مساعدة طبية';
      case 'other': return 'أخرى';
      default: return type;
    }
  };

  // Tabs rendering functions
  const renderOverview = () => {
    const activityData = [
      { name: 'اللجنة الرياضية', students: 120 },
      { name: 'اللجنة الثقافية', students: 85 },
      { name: 'اللجنة الفنية', students: 65 },
      { name: 'الجوالة', students: 45 },
      { name: 'اللجنة العلمية', students: 50 },
      { name: 'الأسر الطلابية', students: 90 },
    ];

    const participationData = [
      { name: 'الفرقة الأولى', value: 300 },
      { name: 'الفرقة الثانية', value: 250 },
      { name: 'الفرقة الثالثة', value: 200 },
      { name: 'الفرقة الرابعة', value: 150 },
    ];
    
    const performanceData = [
      { name: 'يناير', rating: 3.5, votes: 120 },
      { name: 'فبراير', rating: 4.0, votes: 150 },
      { name: 'مارس', rating: 3.8, votes: 180 },
      { name: 'أبريل', rating: 4.5, votes: 210 },
      { name: 'مايو', rating: 4.8, votes: 250 },
      { name: 'يونيو', rating: 4.6, votes: 190 },
    ];
    
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const solidarityData = [
      { name: 'مقبول', value: requests.filter(r => r.status === 'approved').length, color: '#10b981' },
      { name: 'مرفوض', value: requests.filter(r => r.status === 'rejected').length, color: '#ef4444' },
      { name: 'قيد المراجعة', value: requests.filter(r => r.status === 'pending').length, color: '#f59e0b' },
    ];


    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">نظرة عامة على النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-sm font-semibold mb-1">طلبات التكافل الجديدة</p>
                <h4 className="text-3xl font-bold text-slate-900">{requests.filter(r => r.status === 'pending').length}</h4>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500">تحتاج إلى مراجعة</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-sm font-semibold mb-1">الفعاليات القادمة</p>
                <h4 className="text-3xl font-bold text-slate-900">3</h4>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500">خلال هذا الأسبوع</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-sm font-semibold mb-1">الطلاب المسجلين بالأنشطة</p>
                <h4 className="text-3xl font-bold text-slate-900">128</h4>
              </div>
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-500">+12 هذا الأسبوع</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6">معدل المشاركة حسب اللجنة</h4>
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="عدد الطلاب" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6">توزيع المشاركين حسب الفرقة الدراسية</h4>
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {participationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
          <h4 className="text-lg font-bold text-slate-800 mb-6">مؤشرات أداء الأنشطة (متوسط تقييمات الطلاب)</h4>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis yAxisId="left" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                <Line yAxisId="left" type="monotone" dataKey="rating" name="متوسط التقييم (من 5)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="votes" name="عدد المصوتين" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderContentManagement = () => {
    if (currentRole !== 'director' && currentRole !== 'sports_admin') {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold">صلاحيات غير كافية</h3>
          <p className="text-sm">عذراً، هذا القسم مخصص لمدير الرعاية أو مشرفي الأنشطة.</p>
        </div>
      );
    }
    
    return <ActivityManagement />;
  };

  const renderSolidarity = () => {
    if (currentRole !== 'director' && currentRole !== 'solidarity_admin') {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold">صلاحيات غير كافية</h3>
          <p className="text-sm">عذراً، هذا القسم مخصص لمدير الرعاية ومسؤول التكافل الاجتماعي فقط.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="البحث بالاسم أو الرقم الجامعي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
          
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            تصدير إلى Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin inline-block mb-2"></span>
              <p>جاري تحميل الطلبات...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <p>لا توجد طلبات تطابق بحثك.</p>
            </div>
          ) : (
            <table className="w-full text-right text-sm text-slate-600 whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">اسم الطالب</th>
                  <th scope="col" className="px-6 py-4 font-bold">الرقم الجامعي</th>
                  <th scope="col" className="px-6 py-4 font-bold">تاريخ التقديم</th>
                  <th scope="col" className="px-6 py-4 font-bold">نوع المساعدة</th>
                  <th scope="col" className="px-6 py-4 font-bold">الحالة</th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{req.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{req.studentId}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(req.submittedAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {getAssistanceTypeLabel(req.assistanceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <select 
                        className={`text-xs border rounded-md px-2 py-1.5 outline-none transition-colors cursor-pointer ${
                          updatingId === req.id ? 'opacity-50' : ''
                        }`}
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                        disabled={updatingId === req.id}
                      >
                        <option value="pending">قيد المراجعة</option>
                        <option value="approved">مقبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const renderTripManagement = () => {
    if (currentRole !== 'director' && currentRole !== 'trips_admin') {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold">صلاحيات غير كافية</h3>
          <p className="text-sm">عذراً، هذا القسم مخصص لمدير الرعاية ومسؤول الرحلات فقط.</p>
        </div>
      );
    }
    
    return <TripManagement />;
  };

  const renderElectionsManagement = () => {
    if (currentRole !== 'director' && currentRole !== 'elections_admin') {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-bold">صلاحيات غير كافية</h3>
          <p className="text-sm">عذراً، هذا القسم مخصص لمدير الرعاية ومسؤول انتخابات الاتحاد فقط.</p>
        </div>
      );
    }
    
    return <ElectionsManagement />;
  };

  const renderRoles = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">محاكي نظام الصلاحيات</h3>
      <p className="text-slate-600 text-sm max-w-2xl">
        هذا القسم مخصص لتوضيح كيفية عمل نظام الصلاحيات. يمكنك تغيير دور المستخدم الحالي بالأسفل وملاحظة كيف تتغير الأقسام المتاحة لك في القائمة الجانبية ومحتوى الأقسام.
      </p>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
        <h4 className="font-bold text-slate-800 mb-4">الدور الحالي</h4>
        <div className="flex flex-col gap-3">
          <label className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${currentRole === 'director' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input type="radio" name="role" value="director" checked={currentRole === 'director'} onChange={(e) => setCurrentRole(e.target.value)} className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-bold text-slate-900">مدير رعاية الشباب (صلاحيات كاملة)</p>
              <p className="text-xs text-slate-500">يستطيع رؤية وإدارة جميع الأقسام بما في ذلك الأنشطة، طلبات التكافل، والرحلات.</p>
            </div>
          </label>
          <label className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${currentRole === 'solidarity_admin' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input type="radio" name="role" value="solidarity_admin" checked={currentRole === 'solidarity_admin'} onChange={(e) => setCurrentRole(e.target.value)} className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-bold text-slate-900">مسؤول التكافل الاجتماعي</p>
              <p className="text-xs text-slate-500">مسموح له فقط بإدارة طلبات التكافل وتصدير الكشوف.</p>
            </div>
          </label>
          <label className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${currentRole === 'sports_admin' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input type="radio" name="role" value="sports_admin" checked={currentRole === 'sports_admin'} onChange={(e) => setCurrentRole(e.target.value)} className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-bold text-slate-900">مشرف النشاط الرياضي</p>
              <p className="text-xs text-slate-500">مسموح له بإدارة المحتوى والأنشطة الخاصة به فقط.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">إرسال الإشعارات اللحظية</h3>
          <p className="text-sm text-slate-500">قم بإرسال تنبيهات فورية للطلاب عبر المنصة.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('تم إرسال الإشعار بنجاح للطلاب المستهدفين.'); }}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">عنوان الإشعار</label>
            <input required type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="مثال: تحديث هام لرحلة الأقصر" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">محتوى الإشعار</label>
            <textarea required rows={4} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="نص الإشعار..."></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">نوع الإشعار</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="info">معلومة / إعلان</option>
                <option value="success">نجاح / قبول</option>
                <option value="warning">تنبيه هام</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الفئة المستهدفة</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="all">جميع الطلاب</option>
                <option value="trips">المسجلين في الرحلات الحالية</option>
                <option value="solidarity">المتقدمين للتكافل الاجتماعي</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Bell className="w-4 h-4" />
              إرسال الإشعار
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen flex text-right" dir="rtl">
      
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'} fixed h-[calc(100vh-40px)] z-30 md:static md:h-auto`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo2.png" alt="الشعار" className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shadow-sm" />
            <div>
              <h1 className="font-bold text-white leading-tight">بوابة الموظفين</h1>
              <p className="text-[10px] text-slate-500">إدارة رعاية الشباب</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
             <XCircle className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Shield className="w-5 h-5" />
            نظرة عامة
          </button>
          
          {(currentRole === 'director' || currentRole === 'sports_admin') && (
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Calendar className="w-5 h-5" />
              المحتوى والأنشطة
            </button>
          )}

          {(currentRole === 'director' || currentRole === 'trips_admin') && (
            <button 
              onClick={() => setActiveTab('trips')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'trips' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Map className="w-5 h-5" />
              الرحلات والمعسكرات
            </button>
          )}

          {(currentRole === 'director' || currentRole === 'elections_admin') && (
            <button 
              onClick={() => setActiveTab('elections')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'elections' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Vote className="w-5 h-5" />
              انتخابات الاتحاد
            </button>
          )}

          {(currentRole === 'director' || currentRole === 'solidarity_admin') && (
            <button 
              onClick={() => setActiveTab('solidarity')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'solidarity' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <FileText className="w-5 h-5" />
              طلبات التكافل
            </button>
          )}

          {currentRole === 'director' && (
            <button 
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'accounts' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <UserPlus className="w-5 h-5" />
              حسابات الطلاب
            </button>
          )}

          {currentRole === 'director' && (
            <button 
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'feedback' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <MessageSquare className="w-5 h-5" />
              المقترحات والشكاوى
            </button>
          )}

          {currentRole === 'director' && (
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Bell className="w-5 h-5" />
              الإشعارات
            </button>
          )}

          <button 
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${activeTab === 'roles' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            الصلاحيات (محاكي)
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
             <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
               أ.م
             </div>
             <div>
               <p className="text-sm font-bold text-white">أحمد محمد</p>
               <p className="text-xs text-slate-500">
                 {currentRole === 'director' ? 'مدير الإدارة' : currentRole === 'solidarity_admin' ? 'مسؤول تكافل' : currentRole === 'sports_admin' ? 'مشرف نشاط' : currentRole === 'trips_admin' ? 'مسؤول رحلات' : 'مسؤول انتخابات'}
               </p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-bold text-slate-800 text-lg">لوحة الإدارة</h2>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'content' && renderContentManagement()}
            {activeTab === 'trips' && renderTripManagement()}
            {activeTab === 'elections' && renderElectionsManagement()}
            {activeTab === 'solidarity' && renderSolidarity()}
            {activeTab === 'accounts' && <StudentAccounts />}
            {activeTab === 'feedback' && <FeedbackManagement />}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'roles' && renderRoles()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}

