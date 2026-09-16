import React from 'react';
import { CalendarDays, ArrowLeft } from 'lucide-react';

export default function Hero() {
  return (
    <div className="h-auto md:h-auto bg-gradient-to-l from-blue-900 to-blue-700 flex-shrink-0 flex items-center px-4 py-12 md:py-16 sm:px-8 lg:px-12 relative overflow-hidden pb-16 md:pb-20">
      <div className="z-10 max-w-2xl relative">
        <span className="text-blue-200 text-sm font-semibold mb-2 block">بوابة الطالب الرقمية</span>
        <h2 className="text-white text-3xl sm:text-4xl font-extrabold mb-4 leading-snug">
          مرحباً بكم في منصة رعاية الطلاب
          <br/>
          بكلية التربية النوعية
        </h2>
        <p className="text-blue-100 text-lg mb-6 opacity-90 max-w-xl">
          نهدف إلى تنمية مهارات الطلاب وصقل مواهبهم من خلال الأنشطة المتنوعة، وتقديم الدعم والرعاية الشاملة لبناء شخصية متوازنة قادرة على الإبداع والتميز.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#activities" className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-100 text-center flex items-center justify-center gap-2 transition-colors">
            <CalendarDays className="w-5 h-5" />
            استكشف أحدث الفعاليات
          </a>
          <a href="#solidarity" className="bg-blue-800 text-blue-50 border border-blue-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-900 text-center flex items-center justify-center gap-2 transition-colors">
            خدمات التكافل
            <ArrowLeft className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="hidden md:block absolute left-0 bottom-0 top-0 w-1/3 bg-blue-800 opacity-20 transform -skew-x-12 translate-x-12"></div>
      <div className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 gap-4">
          <div className="w-24 h-24 border-4 border-blue-400 opacity-30 rounded-full"></div>
          <div className="w-32 h-32 border-4 border-blue-300 opacity-20 rounded-full mt-12"></div>
      </div>
    </div>
  );
}
