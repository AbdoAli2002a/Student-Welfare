import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';
import { Activity, Trip } from '../types';

export default function SmartSearch() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesRes, tripsRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/trips')
        ]);
        const activitiesData = await activitiesRes.json();
        const tripsData = await tripsRes.json();
        
        // Filter only upcoming
        setActivities(activitiesData.filter((a: Activity) => a.status === 'upcoming'));
        setTrips(tripsData.filter((t: Trip) => t.status === 'متاح التسجيل'));
      } catch (err) {
        console.error('Failed to fetch data for search', err);
      }
    };
    fetchData();
  }, []);

  const filteredActivities = activities.filter(a => {
    const matchQuery = a.title.includes(query) || a.description.includes(query);
    const matchCategory = category === 'all' || category === 'activities' || category === a.committee;
    return matchQuery && matchCategory;
  });

  const filteredTrips = trips.filter(t => {
    const matchQuery = t.title.includes(query);
    const matchCategory = category === 'all' || category === 'trips';
    return matchQuery && matchCategory;
  });

  const hasResults = filteredActivities.length > 0 || filteredTrips.length > 0;
  const showResults = isFocused && query.length > 0;

  return (
    <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 sm:p-4 flex flex-col sm:flex-row gap-3">
        
        {/* Search Input */}
        <div className="flex-grow flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input 
            type="text" 
            placeholder="ابحث عن فعالية أو رحلة قادمة..." 
            className="bg-transparent w-full outline-none text-slate-800 placeholder-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
        </div>

        {/* Category Filter */}
        <div className="sm:w-48 flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <Tag className="w-5 h-5 text-slate-400 ml-3" />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent w-full outline-none text-slate-800 appearance-none cursor-pointer"
          >
            <option value="all">كل التصنيفات</option>
            <option value="activities">الأنشطة العامة</option>
            <option value="sports">اللجنة الرياضية</option>
            <option value="artistic">اللجنة الفنية</option>
            <option value="cultural">اللجنة الثقافية</option>
            <option value="trips">الرحلات والمعسكرات</option>
          </select>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors whitespace-nowrap">
          بحث
        </button>
      </div>

      {/* Dropdown Results */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full left-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-96 overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {filteredActivities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider">الأنشطة والفعاليات</h4>
                  {filteredActivities.map(activity => (
                    <a key={activity.id} href="#activities" className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-blue-50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{activity.title}</h5>
                          <p className="text-xs text-slate-500">{activity.date} • {activity.location}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transform transition-transform group-hover:-translate-x-1 mt-2 sm:mt-0" />
                    </a>
                  ))}
                </div>
              )}
              
              {filteredTrips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider">الرحلات والمعسكرات</h4>
                  {filteredTrips.map(trip => (
                    <a key={trip.id} href="#trips" className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-blue-50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{trip.title}</h5>
                          <p className="text-xs text-slate-500">{trip.date} • {trip.price}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transform transition-transform group-hover:-translate-x-1 mt-2 sm:mt-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              لا توجد نتائج مطابقة للبحث.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
