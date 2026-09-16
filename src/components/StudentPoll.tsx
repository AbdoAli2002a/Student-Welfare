import React, { useState } from 'react';
import { CheckCircle2, BarChart3, TrendingUp } from 'lucide-react';

export default function StudentPoll() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const initialPoll = {
    id: 'poll-1',
    question: 'ما هو النشاط القادم الذي تفضل أن تنظمه إدارة رعاية الطلاب؟',
    options: [
      { id: 'opt-1', text: 'رحلة ترفيهية إلى مدينة ساحلية', votes: 145 },
      { id: 'opt-2', text: 'دورة تدريبية في الذكاء الاصطناعي', votes: 89 },
      { id: 'opt-3', text: 'بطولة كرة قدم خماسية للكلية', votes: 210 },
      { id: 'opt-4', text: 'معرض فني ومسرحي للمواهب', votes: 56 }
    ]
  };

  const [poll, setPoll] = useState(initialPoll);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    
    const updatedOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setPoll({ ...poll, options: updatedOptions });
    setSelectedOptionId(optionId);
    setHasVoted(true);
  };

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <section className="py-12 bg-white border-y border-slate-100" id="poll" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">استطلاع رأي طلابي</h2>
              <p className="text-slate-500 mt-1">شارك برأيك في تحديد وتطوير الأنشطة القادمة</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-slate-600">تصويت نشط</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 relative z-10">{poll.question}</h3>
          
          <div className="space-y-4 relative z-10">
            {poll.options.map(option => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              const isSelected = selectedOptionId === option.id;
              
              return (
                <div key={option.id} className="relative group">
                  {!hasVoted ? (
                    <button
                      onClick={() => handleVote(option.id)}
                      className="w-full text-right p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all font-semibold text-slate-700 hover:shadow-sm"
                    >
                      <span className="flex items-center justify-between">
                        <span>{option.text}</span>
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 transition-colors"></span>
                      </span>
                    </button>
                  ) : (
                    <div className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white opacity-80'}`}>
                      <div 
                        className={`absolute top-0 right-0 bottom-0 opacity-15 transition-all duration-1000 ease-out ${isSelected ? 'bg-indigo-600' : 'bg-slate-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <div className="relative flex justify-between items-center z-10">
                        <span className={`font-semibold flex items-center gap-2 ${isSelected ? 'text-indigo-800' : 'text-slate-700'}`}>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                          {option.text}
                        </span>
                        <div className="text-left flex flex-col items-end">
                          <span className={`font-bold text-lg ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{percentage}%</span>
                          <span className="text-xs text-slate-500 font-medium">{option.votes} صوت</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {hasVoted && (
            <div className="mt-6 flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 animate-in fade-in zoom-in duration-500">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                تم تسجيل تصويتك بنجاح
              </span>
              <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
                إجمالي الأصوات: {totalVotes}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
