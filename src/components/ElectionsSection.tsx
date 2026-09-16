import React, { useState, useEffect } from 'react';
import { Vote, FileText, Megaphone, Trophy } from 'lucide-react';
import { ElectionStep } from '../types';

export default function ElectionsSection() {
  const [steps, setSteps] = useState<ElectionStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
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

  return (
    <div id="elections" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">انتخابات اتحاد الطلاب</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
          صوتك أمانة ومشاركتك تصنع الفارق. تعرف على الجدول الزمني لانتخابات اتحاد الطلاب لهذا العام.
        </p>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = getIconComponent(step.icon);
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-4 transition-colors ${
                    step.status === 'completed' ? 'bg-blue-600 border-blue-100 text-white' :
                    step.status === 'active' ? 'bg-white border-blue-500 text-blue-600 shadow-md' :
                    'bg-slate-100 border-white text-slate-400'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${
                    step.status === 'upcoming' ? 'text-slate-500' : 'text-slate-900'
                  }`}>{step.title}</h3>
                  <p className="text-slate-500 font-medium text-sm">{step.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow-md">
            البرنامج الانتخابي للمرشحين
          </button>
          <button className="bg-white text-blue-700 border border-slate-200 px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold shadow-sm">
            شروط الترشح
          </button>
        </div>
      </div>
    </div>
  );
}
