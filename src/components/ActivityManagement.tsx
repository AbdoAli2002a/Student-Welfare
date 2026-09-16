import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { Calendar, Image as ImageIcon, MapPin, Edit, Plus, X, Users, QrCode } from 'lucide-react';
import QRCodeGeneratorModal from './QRCodeGeneratorModal';

export default function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrActivity, setSelectedQrActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    committee: 'cultural',
    date: '',
    location: '',
    status: 'upcoming' as Activity['status'],
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (activity?: Activity) => {
    if (activity) {
      setEditingId(activity.id);
      setFormData({
        title: activity.title,
        description: activity.description,
        committee: activity.committee,
        date: activity.date,
        location: activity.location,
        status: activity.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        committee: 'cultural',
        date: '',
        location: '',
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
      const url = editingId ? `/api/activities/${editingId}` : '/api/activities';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchActivities();
        handleCloseForm();
      }
    } catch (err) {
      console.error('Failed to save activity', err);
    }
  };

  const getCommitteeLabel = (committee: string) => {
    switch (committee) {
      case 'artistic': return 'النشاط الفني';
      case 'sports': return 'النشاط الرياضي';
      case 'cultural': return 'النشاط الثقافي';
      case 'scouting': return 'الجوالة';
      default: return committee;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'قريباً';
      case 'ongoing': return 'مستمر';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">إدارة المحتوى والأنشطة</h3>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة نشاط جديد
        </button>
      </div>
      
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'تعديل نشاط' : 'إضافة نشاط جديد'}
              </h3>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">عنوان النشاط</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الوصف</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">اللجنة المنظمة</label>
                  <select 
                    value={formData.committee}
                    onChange={(e) => setFormData({...formData, committee: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="artistic">النشاط الفني</option>
                    <option value="sports">النشاط الرياضي</option>
                    <option value="cultural">النشاط الثقافي</option>
                    <option value="scouting">الجوالة</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ النشاط</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المكان</label>
                  <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">حالة النشاط</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="upcoming">قريباً</option>
                    <option value="ongoing">مستمر الآن</option>
                    <option value="completed">مكتمل</option>
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
                  {editingId ? 'حفظ التعديلات' : 'إضافة النشاط'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
          الأنشطة الحالية
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">لا توجد أنشطة مسجلة.</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border border-slate-200 rounded-lg p-4 flex gap-4 items-start">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 flex-shrink-0">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 mb-1">{activity.title}</h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {getCommitteeLabel(activity.committee)} • {getStatusLabel(activity.status)}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenForm(activity)}
                        className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        تعديل
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedQrActivity(activity);
                          setQrModalOpen(true);
                        }}
                        className="text-xs flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <QrCode className="w-3 h-3" />
                        إنشاء QR
                      </button>
                      <button 
                        className="text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        سجل الحضور ({Math.floor(Math.random() * 50) + 10})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedQrActivity && (
        <QRCodeGeneratorModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          activityName={selectedQrActivity.title}
          activityId={selectedQrActivity.id}
        />
      )}
    </div>
  );
}
