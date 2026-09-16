import React, { useEffect, useState } from 'react';
import { Activity } from '../types';
import { Calendar as CalendarIcon, MapPin, ArrowRight, QrCode, MessageSquare, Share2, Filter, ArrowDownUp } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import StarRating from './StarRating';
import QRCodeScannerModal from './QRCodeScannerModal';
import ActivitiesCalendar from './ActivitiesCalendar';
import SurveyModal from './SurveyModal';

export default function ActivitiesList({ setCurrentView }: { setCurrentView?: (view: 'home' | 'admin' | 'profile' | 'notifications' | 'guide') => void }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'calendar' | 'archive'>('current');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortDate, setSortDate] = useState<'default' | 'asc' | 'desc'>('default');
  const { addToast } = useToast();

  const handleShare = async (activity: Activity) => {
    const activityDate = new Date(activity.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const shareText = `انضم إلينا في "${activity.title}"!\nالموعد: ${activityDate}\nالمكان: ${activity.location}\n\nللتفاصيل والتسجيل، قم بزيارة منصة رعاية الشباب.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText + '\n' + window.location.href);
      addToast('success', 'تم نسخ تفاصيل النشاط للحافظة بنجاح');
    }
  };

  useEffect(() => {
    const loadInterests = () => {
      try {
        const saved = localStorage.getItem('student_interests');
        if (saved) setUserInterests(JSON.parse(saved));
      } catch {}
    };
    
    loadInterests();
    window.addEventListener('interestsUpdated', loadInterests);
    return () => window.removeEventListener('interestsUpdated', loadInterests);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('فشل في جلب الفعاليات');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل الفعاليات.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleRateActivity = async (id: string, rating: number) => {
    try {
      const response = await fetch(`/api/activities/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (response.ok) {
        const { activity } = await response.json();
        setActivities(prev => prev.map(a => a.id === id ? activity : a));
      }
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">قريباً</span>;
      case 'ongoing':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">مستمر الآن</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">مكتمل</span>;
      default:
        return null;
    }
  };

  const getCommitteeColor = (committee: Activity['committee']) => {
    switch (committee) {
      case 'artistic': return 'bg-orange-500';
      case 'sports': return 'bg-green-500';
      case 'cultural': return 'bg-purple-500';
      case 'scouting': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const filteredActivities = activities.filter((activity) => {
      // Tab filter
      if (activeTab === 'current' && activity.status === 'completed') return false;
      if (activeTab === 'archive' && activity.status !== 'completed') return false;
      
      // Type filter
      if (filterType !== 'all' && activity.committee !== filterType) return false;
      
      return true;
  }).sort((a, b) => {
      // Date Sort
      if (sortDate === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortDate === 'desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      // Default Sort (Interests first)
      const aMatch = userInterests.includes(a.committee) ? 1 : 0;
      const bMatch = userInterests.includes(b.committee) ? 1 : 0;
      return bMatch - aMatch;
  });

  return (
    <div id="events" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">أحدث الفعاليات والأنشطة</h2>
            <p className="text-lg text-slate-600 max-w-2xl">ابق على اطلاع بأحدث الأنشطة والفعاليات التي تنظمها لجان مكتب رعاية الطلاب.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'current' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              الأنشطة الحالية
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'calendar' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              التقويم
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'archive' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              الأرشيف
            </button>
          </div>
        </div>

        {activeTab !== 'calendar' && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-bold shrink-0">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>تصفية الأنشطة:</span>
            </div>
            
            <div className="flex-grow w-full flex flex-col sm:flex-row gap-4 items-center">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="all">كل الأنواع</option>
                <option value="sports">نشاط رياضي</option>
                <option value="cultural">نشاط ثقافي</option>
                <option value="artistic">نشاط فني</option>
                <option value="scouting">نشاط جوالة</option>
                <option value="scientific">نشاط علمي</option>
                <option value="social">نشاط اجتماعي</option>
              </select>

              <div className="w-full sm:w-auto flex items-center gap-2 sm:border-r sm:border-slate-200 sm:pr-4">
                <ArrowDownUp className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select 
                  value={sortDate}
                  onChange={(e) => setSortDate(e.target.value as any)}
                  className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="default">الترتيب الافتراضي (المقترحات أولاً)</option>
                  <option value="asc">تاريخ البدء (الأقدم أولاً)</option>
                  <option value="desc">تاريخ البدء (الأحدث أولاً)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100 font-semibold">
            {error}
          </div>
        ) : activeTab === 'calendar' ? (
          <ActivitiesCalendar activities={activities} />
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 font-semibold">
            {activeTab === 'current' ? 'لا توجد أنشطة حالية.' : 'لا توجد أنشطة في الأرشيف.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full group">
                <div className={`h-2 w-full ${getCommitteeColor(activity.committee)}`}></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {getStatusBadge(activity.status)}
                      {userInterests.includes(activity.committee) && activeTab === 'current' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                          🌟 مقترح لك
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleShare(activity)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                      title="مشاركة النشاط"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-3 mt-auto pt-6 border-t border-slate-100">
                    <div className="flex items-center text-slate-500 text-sm">
                      <CalendarIcon className="w-4 h-4 ml-2 text-slate-400" />
                      <span>{new Date(activity.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 ml-2 text-slate-400" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                    {activity.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-600 mb-2">التقييم العام:</p>
                          <StarRating 
                            initialRating={activity.rating || 0} 
                            totalReviews={activity.reviewsCount || 0}
                            readonly={true}
                          />
                        </div>
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setSurveyOpen(true);
                          }}
                          className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          قيّم الفعالية
                        </button>
                      </div>
                    )}
                    {activity.status !== 'completed' && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setScannerOpen(true);
                          }}
                          className="w-full flex justify-center items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors py-2 rounded-lg font-bold text-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          تسجيل الحضور (QR)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedActivity && (
        <QRCodeScannerModal 
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          activityName={selectedActivity.title}
          onSuccess={() => {
            setScannerOpen(false);
            // In a real app we'd update the backend, we can optionally switch view to profile here
          }}
        />
      )}

      {selectedActivity && (
        <SurveyModal 
          isOpen={surveyOpen}
          onClose={() => setSurveyOpen(false)}
          activityName={selectedActivity.title}
          onSubmit={(rating) => {
            handleRateActivity(selectedActivity.id, rating);
            setSurveyOpen(false);
          }}
        />
      )}
    </div>
  );
}
