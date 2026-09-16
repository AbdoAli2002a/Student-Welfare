const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

const importsOld = "import { Star, MessageSquare } from 'lucide-react';";
const importsNew = `import { Star, MessageSquare } from 'lucide-react';
import sportsCover from '../assets/images/sports_cover_1789509857101.jpg';
import artisticCover from '../assets/images/artistic_cover_1789509868660.jpg';
import culturalCover from '../assets/images/cultural_cover_1789509879628.jpg';
import scoutsCover from '../assets/images/scouts_cover_1789509891895.jpg';
import socialCover from '../assets/images/social_cover_1789509904037.jpg';`;

if (code.includes(importsOld)) {
    code = code.replace(importsOld, importsNew);
}

const committeesOld = `  const committees = [
    { id: 'sports', name: 'اللجنة الرياضية', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' },
    { id: 'artistic', name: 'اللجنة الفنية', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' },
    { id: 'cultural', name: 'اللجنة الثقافية', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
    { id: 'scouts', name: 'الجوالة والخدمة العامة', icon: Tent, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200' },
    { id: 'social', name: 'اللجنة الاجتماعية', icon: Users, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200' }
  ];`;

const committeesNew = `  const committees = [
    { id: 'sports', name: 'اللجنة الرياضية', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200', image: sportsCover },
    { id: 'artistic', name: 'اللجنة الفنية', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200', image: artisticCover },
    { id: 'cultural', name: 'اللجنة الثقافية', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200', image: culturalCover },
    { id: 'scouts', name: 'الجوالة والخدمة العامة', icon: Tent, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200', image: scoutsCover },
    { id: 'social', name: 'اللجنة الاجتماعية', icon: Users, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200', image: socialCover }
  ];`;

if (code.includes(committeesOld)) {
    code = code.replace(committeesOld, committeesNew);
}

const renderOld = `          {/* Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
              {committees.filter(c => c.id === activeCommittee).map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                    <div className={\`p-4 rounded-xl \${c.bg} \${c.color}\`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{c.name}</h2>
                      <p className="text-slate-500">معلومات وتفاصيل الانضمام للجنة</p>
                    </div>
                  </div>
                );
              })}`;

const renderNew = `          {/* Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {committees.filter(c => c.id === activeCommittee).map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id}>
                    {c.image && (
                      <div className="w-full h-48 sm:h-64 overflow-hidden relative">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                          <h2 className="text-3xl font-bold text-white drop-shadow-md">{c.name}</h2>
                        </div>
                      </div>
                    )}
                    <div className="p-6 sm:p-10">
                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                        <div className={\`p-4 rounded-xl \${c.bg} \${c.color}\`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-1">{c.name}</h2>
                          <p className="text-slate-500">معلومات وتفاصيل الانضمام للجنة</p>
                        </div>
                      </div>`;

if (code.includes(renderOld)) {
    code = code.replace(renderOld, renderNew);
} else {
    console.error("renderOld not found");
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
