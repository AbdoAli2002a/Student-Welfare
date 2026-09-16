import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Trash2, Check, ArrowLeft, Clock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function NotificationCenter({ onBack }: { onBack: () => void }) {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const simulateReminders = () => {
    // Just for UI testing
    const reminder = {
      id: Date.now(),
      title: 'تذكير: رحلة الأقصر غداً',
      content: 'تبدأ رحلة الأقصر وأسوان غداً في تمام الساعة ٧ صباحاً. لا تنسَ إحضار التذكرة والبطاقة الجامعية.',
      type: 'warning',
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [reminder, ...prev]);
    addToast('تم تفعيل التذكيرات التلقائية (محاكاة قبل ٢٤ ساعة)', 'success');
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('ar-EG', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }).format(date);
    } catch {
      return isoString; // fallback
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 transform rotate-180" />
          العودة للرئيسية
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:px-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">مركز الإشعارات</h1>
                <p className="text-sm text-slate-500">لديك {unreadCount} إشعار غير مقروء</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={simulateReminders}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg"
              >
                <Clock className="w-4 h-4" />
                تفعيل تذكيرات 24 ساعة (محاكاة)
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>
          </div>
          
          {/* List */}
          <div className="divide-y divide-slate-100 min-h-[300px]">
            {isLoading ? (
               <div className="p-12 text-center text-slate-400">جاري تحميل الإشعارات...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-6 sm:px-10 flex gap-4 transition-colors group ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}
                >
                  <div className="shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`font-bold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${notification.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                      {notification.content}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          تحديد كمقروء
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Bell className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد إشعارات</h3>
                <p className="text-slate-500">أنت على اطلاع دائم بكافة التحديثات.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
