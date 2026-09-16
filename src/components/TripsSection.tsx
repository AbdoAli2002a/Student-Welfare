import React, { useState, useEffect } from 'react';
import { Map, Calendar, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';
import SurveyModal from './SurveyModal';
import { Trip } from '../types';

export default function TripsSection() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current');
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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

  const handleRateTrip = async (id: string, rating: number) => {
    try {
      const response = await fetch(`/api/trips/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (response.ok) {
        const { trip } = await response.json();
        setTrips(prev => prev.map(t => t.id === id ? trip : t));
      }
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
  };

  const filteredTrips = trips.filter((trip) => 
    activeTab === 'current' ? trip.status !== 'منتهية' : trip.status === 'منتهية'
  );

  return (
    <div id="trips" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">الرحلات والمعسكرات</h2>
            <p className="text-lg text-slate-600 max-w-2xl">استكشف مصر وشارك في رحلاتنا الترفيهية والتثقيفية المنظمة خصيصاً لطلاب الكلية.</p>
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
              الرحلات الحالية
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 font-semibold">
            {activeTab === 'current' ? 'لا توجد رحلات متاحة حالياً.' : 'لا توجد رحلات في الأرشيف.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTrips.map((trip) => (
            <div key={trip.id} className="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="sm:w-2/5 h-48 sm:h-auto relative">
                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {trip.status}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between sm:w-3/5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{trip.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-600 text-sm">
                      <Calendar className="w-4 h-4 ml-2 text-blue-600" />
                      <span>{trip.date} • {trip.duration}</span>
                    </div>
                    <div className="flex items-center text-slate-600 text-sm">
                      <Users className="w-4 h-4 ml-2 text-blue-600" />
                      <span>قيمة الاشتراك: {trip.price}</span>
                    </div>
                  </div>
                </div>
                
                {trip.status === 'منتهية' ? (
                  <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-600 mb-2">التقييم العام:</p>
                      <StarRating 
                        initialRating={trip.rating || 0} 
                        totalReviews={trip.reviewsCount || 0}
                        readonly={true}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTrip(trip);
                        setSurveyOpen(true);
                      }}
                      className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      قيّم الرحلة
                    </button>
                  </div>
                ) : (
                  <button 
                    disabled={trip.status === 'اكتمل العدد'}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold transition-colors ${
                      trip.status === 'اكتمل العدد' 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {trip.status === 'اكتمل العدد' ? 'مغلق' : 'حجز مكان'}
                    {trip.status !== 'اكتمل العدد' && <ArrowLeft className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {selectedTrip && (
        <SurveyModal 
          isOpen={surveyOpen}
          onClose={() => setSurveyOpen(false)}
          activityName={selectedTrip.title}
          onSubmit={(rating) => {
            handleRateTrip(selectedTrip.id, rating);
            setSurveyOpen(false);
          }}
        />
      )}
    </div>
  );
}
