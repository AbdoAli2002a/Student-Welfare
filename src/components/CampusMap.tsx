import React, { useState } from 'react';
import { MapPin, BookOpen, Users, Trophy, Coffee, Info, Search, Map as MapIcon, X } from 'lucide-react';

interface Location {
  id: string;
  title: string;
  category: 'welfare' | 'academic' | 'sports' | 'facilities';
  description: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  icon: React.ElementType;
}

const locations: Location[] = [
  {
    id: '1',
    title: 'مكتب رعاية الطلاب',
    category: 'welfare',
    description: 'المقر الرئيسي للأنشطة، التكافل الاجتماعي، وحجز الرحلات.',
    x: 35,
    y: 40,
    icon: Users
  },
  {
    id: '2',
    title: 'مبنى القاعات الدراسية',
    category: 'academic',
    description: 'يضم القاعات والمدرجات الرئيسية للمحاضرات.',
    x: 60,
    y: 50,
    icon: BookOpen
  },
  {
    id: '3',
    title: 'ملاعب الكلية',
    category: 'sports',
    description: 'ملاعب كرة القدم، السلة، والكرة الطائرة للأنشطة الرياضية.',
    x: 75,
    y: 25,
    icon: Trophy
  },
  {
    id: '4',
    title: 'شؤون الطلاب',
    category: 'welfare',
    description: 'استخراج الكارنيهات، الإفادات، والتعاملات الإدارية.',
    x: 30,
    y: 65,
    icon: Info
  },
  {
    id: '5',
    title: 'الكافتيريا واستراحة الطلاب',
    category: 'facilities',
    description: 'مكان مخصص للاستراحة وتناول الوجبات والمشروبات.',
    x: 80,
    y: 75,
    icon: Coffee
  }
];

export default function CampusMap() {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.title.includes(searchTerm) || loc.description.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'welfare': return 'bg-blue-500 text-white border-blue-600';
      case 'academic': return 'bg-purple-500 text-white border-purple-600';
      case 'sports': return 'bg-green-500 text-white border-green-600';
      case 'facilities': return 'bg-orange-500 text-white border-orange-600';
      default: return 'bg-slate-500 text-white border-slate-600';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'welfare': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">رعاية وشؤون</span>;
      case 'academic': return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">أكاديمي</span>;
      case 'sports': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-bold">رياضي</span>;
      case 'facilities': return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-bold">مرافق</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] p-4 sm:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center justify-center gap-3 mb-4">
            <MapIcon className="w-8 h-8 text-blue-600" />
            الخريطة التفاعلية للكلية
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            دليلك للوصول السريع إلى مكاتب رعاية الطلاب، القاعات الدراسية، والمرافق الهامة.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[600px]">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] lg:h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="ابحث عن مكان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-shadow"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedCategory('welfare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'welfare' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  الرعاية والشؤون
                </button>
                <button
                  onClick={() => setSelectedCategory('academic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'academic' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                >
                  قاعات دراسية
                </button>
                <button
                  onClick={() => setSelectedCategory('sports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === 'sports' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                >
                  ملاعب
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredLocations.map(loc => {
                const Icon = loc.icon;
                const isActive = activeLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(isActive ? null : loc)}
                    className={`w-full text-right p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm mb-1 ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>{loc.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{loc.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredLocations.length === 0 && (
                <div className="text-center text-slate-500 py-10 text-sm">
                  لا توجد نتائج مطابقة لبحثك.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Map Area */}
          <div className="w-full lg:w-2/3 bg-emerald-50/50 rounded-3xl shadow-inner border-2 border-emerald-100/50 overflow-hidden relative min-h-[400px]">
            {/* Abstract Background Elements representing a campus */}
            <div className="absolute top-[30%] left-0 right-0 h-16 bg-slate-200/60 transform -skew-y-6"></div>
            <div className="absolute top-[60%] left-0 right-0 h-12 bg-slate-200/60 transform skew-y-3"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-green-200/40 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-blue-100/40 rounded-full blur-xl"></div>
            
            {/* Central Garden */}
            <div className="absolute top-[45%] left-[45%] w-[20%] h-[15%] bg-emerald-200/50 rounded-full border border-emerald-300/50"></div>

            {/* Render Pins */}
            {locations.map(loc => {
              const Icon = loc.icon;
              const isActive = activeLocation?.id === loc.id;
              
              // Only show if it matches filter (or show all with opacity diff)
              const isFilteredIn = filteredLocations.some(l => l.id === loc.id);

              return (
                <div 
                  key={loc.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isFilteredIn ? 'opacity-100 scale-100' : 'opacity-30 scale-75 pointer-events-none'
                  } ${isActive ? 'z-20' : 'z-10'}`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <button
                    onClick={() => setActiveLocation(isActive ? null : loc)}
                    className="relative group focus:outline-none"
                  >
                    {/* Pin Marker */}
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isActive ? 'bg-blue-500' : ''}`}></div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-transform transform ${
                        isActive 
                          ? 'scale-110 ring-4 ring-blue-500/20 ' + getCategoryColor(loc.category)
                          : 'hover:scale-110 ' + getCategoryColor(loc.category)
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* Tooltip on Hover (only if not active to avoid overlap) */}
                    {!isActive && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {loc.title}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    )}
                  </button>

                  {/* Active Popup */}
                  {isActive && (
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform origin-top animate-in fade-in zoom-in duration-200">
                      <div className="p-4 relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveLocation(null); }}
                          className="absolute top-2 left-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mb-2">
                          {getCategoryBadge(loc.category)}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mb-1">{loc.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{loc.description}</p>
                        
                        <a 
                          href="#guide" 
                          className="mt-4 block w-full text-center bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold text-xs py-2 rounded-lg border border-slate-200 transition-colors"
                        >
                          عرض الأنشطة المرتبطة
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
