import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Bell, BellRing, MapPin, Clock, CalendarPlus, Download } from 'lucide-react';
import { Activity } from '../types';
import { useToast } from '../contexts/ToastContext';

interface ActivitiesCalendarProps {
  activities: Activity[];
}

export default function ActivitiesCalendar({ activities }: ActivitiesCalendarProps) {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toggleReminder = (activityId: string) => {
    setReminders(prev => {
      const isNowActive = !prev[activityId];
      if (isNowActive) {
        showToast('تم تفعيل التذكير. سنقوم بتنبيهك قبل موعد النشاط.', 'info');
      } else {
        showToast('تم إلغاء التذكير.', 'warning');
      }
      return {
        ...prev,
        [activityId]: isNowActive
      };
    });
  };

  const exportToGoogleCalendar = (activity: Activity) => {
    const title = encodeURIComponent(activity.title);
    const details = encodeURIComponent(activity.description || '');
    const location = encodeURIComponent(activity.location || '');
    
    const dateObj = new Date(activity.date);
    const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);
    const end = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;
    window.open(url, '_blank');
  };

  const downloadICS = () => {
    const currentMonthActivities = activities.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    if (currentMonthActivities.length === 0) {
      alert("لا توجد أنشطة في هذا الشهر لتصديرها.");
      return;
    }

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Student Activities//AR\n";
    
    currentMonthActivities.forEach(activity => {
      const dateObj = new Date(activity.date);
      const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);
      const end = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `DTSTART:${start}\n`;
      icsContent += `DTEND:${end}\n`;
      icsContent += `SUMMARY:${activity.title}\n`;
      icsContent += `DESCRIPTION:${activity.description || ''}\n`;
      icsContent += `LOCATION:${activity.location || ''}\n`;
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `activities_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create calendar grid
  const renderCalendarDays = () => {
    const days = [];
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // Add day headers
    dayNames.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-bold text-slate-500 py-2 text-sm">
          {day}
        </div>
      );
    });

    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-slate-100 bg-slate-50"></div>);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Find activities for this day
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate.getDate() === day && 
               activityDate.getMonth() === currentDate.getMonth() &&
               activityDate.getFullYear() === currentDate.getFullYear();
      });

      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === currentDate.getMonth() && 
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div key={`day-${day}`} className={`min-h-[100px] border border-slate-100 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`text-sm font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayActivities.map(activity => (
              <div key={activity.id} className="text-xs p-1.5 rounded bg-blue-100 border border-blue-200 text-blue-800">
                <div className="font-semibold line-clamp-1" title={activity.title}>{activity.title}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-blue-600 truncate">{activity.location}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => exportToGoogleCalendar(activity)}
                      className="text-blue-600 hover:text-blue-800"
                      title="إضافة إلى تقويم Google"
                    >
                      <CalendarPlus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => toggleReminder(activity.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title={reminders[activity.id] ? "إلغاء التذكير" : "تفعيل التذكير"}
                    >
                      {reminders[activity.id] ? <BellRing className="w-3 h-3 text-yellow-500" /> : <Bell className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" dir="rtl">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
        <h3 className="text-xl font-bold text-slate-800">تقويم الأنشطة والفعاليات</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={downloadICS}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            title="تصدير أنشطة الشهر (iCal)"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير iCal</span>
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="text-lg font-bold text-blue-900 w-32 text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-4 text-sm text-slate-600 font-semibold justify-center">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <span>انقر على الجرس لتفعيل التذكير</span>
        </div>
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-yellow-500" />
          <span>تم تفعيل التذكير</span>
        </div>
      </div>
    </div>
  );
}
