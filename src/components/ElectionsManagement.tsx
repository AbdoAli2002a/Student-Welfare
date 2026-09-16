import React, { useState, useEffect } from 'react';
import { ElectionStep } from '../types';
import { Vote, FileText, Megaphone, Trophy, Edit, Plus, X, Trash2 } from 'lucide-react';

export default function ElectionsManagement() {
  const [steps, setSteps] = useState<ElectionStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    icon: 'FileText',
    status: 'upcoming' as ElectionStep['status'],
  });

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setSteps(data);
    } catch (err) {
      console.error('Failed to fetch elections', err);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Megaphone': return Megaphone;
      case 'Vote': return Vote;
      case 'Trophy': return Trophy;
      default: return FileText;
    }
  };

  const handleOpenForm = (step?: ElectionStep) => {
    if (step) {
      setEditingId(step.id);
      setFormData({
        title: step.title,
        date: step.date,
        icon: step.icon,
        status: step.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        icon: 'FileText',
        status: 'upcoming',
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/elections/${editingId}` : '/api/elections';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchSteps();
        handleCloseForm();
      }
    } catch (err) {
      console.error('Failed to save election step', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المرحلة؟')) {
      try {
        const response = await fetch(`/api/elections/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchSteps();
        }
      } catch (err) {
        console.error('Failed to delete election step', err);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">إدارة انتخابات الاتحاد</h3>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مرحلة جديدة
        </button>
      </div>
      
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'تعديل مرحلة' : 'إضافة مرحلة جديدة'}
              </h3>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم المرحلة</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ المرحلة</label>
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">أيقونة المرحلة</label>
                  <select 
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="FileText">استمارة / ورقة (FileText)</option>
                    <option value="Megaphone">دعاية / إعلان (Megaphone)</option>
                    <option value="Vote">تصويت (Vote)</option>
                    <option value="Trophy">نتيجة / كأس (Trophy)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">حالة المرحلة</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="upcoming">قادمة (Upcoming)</option>
                    <option value="active">جارية (Active)</option>
                    <option value="completed">مكتملة (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseForm}
                  className="px-5 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'حفظ التعديلات' : 'إضافة المرحلة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
          مراحل الانتخابات الحالية
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
            </div>
          ) : steps.length === 0 ? (
            <div className="text-center py-8 text-slate-500">لا توجد مراحل مسجلة.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((step) => {
                const IconComponent = getIconComponent(step.icon);
                return (
                  <div key={step.id} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          step.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                          step.status === 'active' ? 'bg-amber-100 text-amber-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{step.title}</h4>
                          <p className="text-sm text-slate-500">{step.date}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        step.status === 'completed' ? 'bg-green-100 text-green-700' :
                        step.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {step.status === 'completed' ? 'مكتملة' : step.status === 'active' ? 'جارية' : 'قادمة'}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenForm(step)}
                          className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          تعديل
                        </button>
                        <button 
                          onClick={() => handleDelete(step.id)}
                          className="text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded font-semibold transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          حذف
                        </button>
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
  );
}
