import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { Map, Calendar, Users, Edit, Plus, X, Trash2 } from 'lucide-react';

export default function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    duration: '',
    price: '',
    status: 'متاح التسجيل' as Trip['status'],
    image: '',
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (trip?: Trip) => {
    if (trip) {
      setEditingId(trip.id);
      setFormData({
        title: trip.title,
        date: trip.date,
        duration: trip.duration,
        price: trip.price,
        status: trip.status,
        image: trip.image,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        duration: '',
        price: '',
        status: 'متاح التسجيل',
        image: '',
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
      const url = editingId ? `/api/trips/${editingId}` : '/api/trips';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchTrips();
        handleCloseForm();
      }
    } catch (err) {
      console.error('Failed to save trip', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      try {
        const response = await fetch(`/api/trips/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTrips();
        }
      } catch (err) {
        console.error('Failed to delete trip', err);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">إدارة الرحلات والمعسكرات</h3>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة رحلة جديدة
        </button>
      </div>
      
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'تعديل رحلة' : 'إضافة رحلة جديدة'}
              </h3>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">عنوان الرحلة</label>
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ الرحلة (مثال: إجازة منتصف العام)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المدة (مثال: 5 أيام / 4 ليالي)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">سعر الاشتراك</label>
                  <input 
                    required
                    type="text" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">حالة الرحلة</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="متاح التسجيل">متاح التسجيل</option>
                    <option value="اكتمل العدد">اكتمل العدد</option>
                    <option value="منتهية">منتهية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">رابط الصورة</label>
                <input 
                  type="url" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
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
                  {editingId ? 'حفظ التعديلات' : 'إضافة الرحلة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
          الرحلات الحالية
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-8 text-slate-500">لا توجد رحلات مسجلة.</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <div key={trip.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-24 h-32 sm:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={trip.image || 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&q=80&w=200'} alt={trip.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow w-full">
                    <h4 className="font-bold text-slate-900 mb-1">{trip.title}</h4>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {trip.date} • {trip.duration}
                    </p>
                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full ${
                        trip.status === 'متاح التسجيل' ? 'bg-green-100 text-green-700' : 
                        trip.status === 'منتهية' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trip.status}
                      </span>
                      <span className="mx-2">•</span>
                      <Users className="w-3 h-3" /> {trip.price}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenForm(trip)}
                        className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDelete(trip.id)}
                        className="text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded font-semibold transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
