import React from 'react';
import { Palette, Trophy, BookOpen, Compass } from 'lucide-react';

export default function ServicesGrid() {
  const services = [
    {
      title: 'اللجنة الفنية',
      description: 'تنمية المهارات الفنية من خلال المسابقات الموسيقية والتشكيلية والأشغال اليدوية.',
      icon: Palette,
      color: 'bg-orange-100 text-orange-600',
      badge: '12 فعالية نشطة',
      badgeColor: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'اللجنة الرياضية',
      description: 'تنظيم الدوريات الرياضية ومسابقات اللياقة البدنية والمنتخبات الجماعية والفردية.',
      icon: Trophy,
      color: 'bg-green-100 text-green-600',
      badge: 'متاح الآن',
      badgeColor: 'text-green-600 bg-green-50',
    },
    {
      title: 'اللجنة الثقافية',
      description: 'صالونات أدبية، مسابقات شعرية، ومجلات حائط تعبر عن رؤية وإبداع طلابنا.',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-600',
      badge: 'قريباً: مسابقة الشعر',
      badgeColor: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'لجنة الجوالة',
      description: 'بناء الشخصية القيادية من خلال معسكرات الخدمة العامة وحياة الخلاء.',
      icon: Compass,
      color: 'bg-blue-100 text-blue-600',
      badge: 'تسجيل المخيم مفتوح',
      badgeColor: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div id="activities" className="flex-grow p-4 sm:p-8 flex flex-col bg-slate-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 text-xl font-bold border-r-4 border-blue-900 pr-3">اللجان والأنشطة الطلابية</h3>
        <a href="#" className="text-blue-700 text-sm font-semibold hover:underline">عرض كافة اللجان</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow">
        {services.map((service) => (
          <div key={service.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
              <service.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h4 className="text-slate-800 font-bold mb-2 text-lg">{service.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.description}</p>
            <span className={`text-xs font-bold py-1 px-2 rounded uppercase ${service.badgeColor}`}>
              {service.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
