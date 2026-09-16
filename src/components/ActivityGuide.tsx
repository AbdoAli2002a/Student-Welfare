import React, { useState } from 'react';
import { Users, Palette, Trophy, BookOpen, Tent, Target, CheckCircle, ArrowLeft, Plus } from 'lucide-react';
import ActivityRegistrationModal from './ActivityRegistrationModal';
import ActivityReviewModal from './ActivityReviewModal';
import StarRating from './StarRating';
import { Star, MessageSquare } from 'lucide-react';
import sportsCover from '../assets/images/sports_cover_1789509857101.jpg';
import artisticCover from '../assets/images/artistic_cover_1789509868660.jpg';
import culturalCover from '../assets/images/cultural_cover_1789509879628.jpg';
import scoutsCover from '../assets/images/scouts_cover_1789509891895.jpg';
import socialCover from '../assets/images/social_cover_1789509904037.jpg';

export default function ActivityGuide({ onBack }: { onBack: () => void }) {
  const [activeCommittee, setActiveCommittee] = useState<string>('sports');
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewActivity, setSelectedReviewActivity] = useState<string>('');
  
  const [reviews, setReviews] = useState<Record<string, {id: number, studentName: string, activityName: string, rating: number, comment: string, date: string}[]>>({
    sports: [
      { id: 1, studentName: 'أحمد محمود', activityName: 'دوري كرة القدم', rating: 5, comment: 'تنظيم رائع ومنافسة قوية، شكراً للجنة الرياضية.', date: '٢٠ أكتوبر ٢٠٢٣' },
      { id: 2, studentName: 'مصطفى كامل', activityName: 'مسابقة الشطرنج', rating: 4, comment: 'نشاط ممتع لكن يرجى توفير مكان أهدأ في المرة القادمة.', date: '١٥ نوفمبر ٢٠٢٣' }
    ],
    cultural: [
      { id: 3, studentName: 'سارة خالد', activityName: 'ندوة التنمية البشرية', rating: 5, comment: 'محاضرة ملهمة جداً واستفدت منها كثيراً.', date: '١ ديسمبر ٢٠٢٣' }
    ]
  });

  const handleAddReview = (committeeId: string, review: { activityName: string; rating: number; comment: string }) => {
    setReviews(prev => {
      const committeeReviews = prev[committeeId] || [];
      return {
        ...prev,
        [committeeId]: [
          {
            id: Date.now(),
            studentName: 'الطالب الحالي',
            activityName: review.activityName,
            rating: review.rating,
            comment: review.comment,
            date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
          },
          ...committeeReviews
        ]
      };
    });
  };

  const committees = [
    { id: 'sports', name: 'اللجنة الرياضية', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200', image: sportsCover },
    { id: 'artistic', name: 'اللجنة الفنية', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200', image: artisticCover },
    { id: 'cultural', name: 'اللجنة الثقافية', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200', image: culturalCover },
    { id: 'scouts', name: 'الجوالة والخدمة العامة', icon: Tent, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200', image: scoutsCover },
    { id: 'social', name: 'اللجنة الاجتماعية', icon: Users, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200', image: socialCover }
  ];

  const committeeDetails: Record<string, any> = {
    sports: {
      goals: ['تنمية الوعي الرياضي والصحي لدى الطلاب', 'اكتشاف المواهب الرياضية وتنميتها', 'تنظيم البطولات والدورات الرياضية'],
      requirements: ['أن يكون الطالب مقيداً بالكلية', 'الالتزام بالأخلاق الرياضية', 'الرغبة في المشاركة الفعالة'],
      howToJoin: 'يتم التقديم عبر استمارة الانضمام الإلكترونية المتاحة في بداية كل فصل دراسي، تليها اختبارات تقييم للمواهب في الألعاب المختلفة.',
      completedActivities: ['دوري كرة القدم', 'مسابقة الشطرنج', 'ماراثون الجري']
    },
    artistic: {
      goals: ['صقل المواهب الفنية للطلاب (رسم، موسيقى، مسرح، غناء)', 'المشاركة في المسابقات القمية على مستوى الجامعة', 'إقامة معارض وحفلات فنية'],
      requirements: ['امتلاك موهبة فنية قابلة للتطوير', 'التفرغ الجزئي لحضور البروفات والتدريبات'],
      howToJoin: 'تعبئة نموذج الانضمام الإلكتروني، ثم الحضور إلى تجارب الأداء (Auditions) أو تقديم سابقة أعمال (Portfolio).',
      completedActivities: ['معرض الفنون التشكيلية', 'حفل الكورال السنوي']
    },
    cultural: {
      goals: ['رفع الوعي الثقافي والديني', 'تشجيع المواهب الأدبية (شعر، قصة، مقال)', 'إصدار المجلات وإقامة الندوات'],
      requirements: ['الاهتمام بالقراءة والمطالعة', 'مهارات التواصل والإلقاء'],
      howToJoin: 'تسجيل البيانات عبر المنصة، واجتياز المقابلة الشخصية لتقييم المهارات الثقافية والمعلومات العامة.',
      completedActivities: ['ندوة التنمية البشرية', 'مسابقة إلقاء الشعر']
    },
    scouts: {
      goals: ['غرس روح التطوع والاعتماد على النفس', 'خدمة البيئة والمجتمع', 'تنظيم المعسكرات الكشفية والتدريبية'],
      requirements: ['اللياقة البدنية المناسبة', 'حب العمل الجماعي والتطوعي', 'الالتزام بمبادئ وقوانين الكشافة'],
      howToJoin: 'الانضمام لفريق التدريب الأساسي في بداية العام لاجتياز دورة الإعداد والقبول كعضو عامل.',
      completedActivities: ['المعسكر الكشفي للخدمة العامة', 'حملة تجميل الكلية']
    },
    social: {
      goals: ['تنظيم الرحلات والمعسكرات الترفيهية', 'تنظيم حملات التبرع بالدم والقوافل الخيرية', 'تنمية الروابط الاجتماعية بين الطلاب'],
      requirements: ['مهارات التنظيم والتخطيط', 'اللباقة وحسن التصرف', 'روح المبادرة'],
      howToJoin: 'ملء استمارة التقديم وحضور ورشة عمل تعريفية عن إدارة الأنشطة الاجتماعية والمشاركة في أول فعالية كتجربة.',
      completedActivities: ['رحلة الأقصر وأسوان', 'حملة التبرع بالدم']
    }
  };

  const activeDetails = committeeDetails[activeCommittee];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 transform rotate-180" />
          العودة للرئيسية
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">دليل الأنشطة الطلابية</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">تعرف على اللجان المختلفة، أهدافها، وكيفية الانضمام لتصبح جزءاً من النشاط الطلابي في كليتك.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            {committees.map((committee) => {
              const Icon = committee.icon;
              const isActive = activeCommittee === committee.id;
              return (
                <button
                  key={committee.id}
                  onClick={() => setActiveCommittee(committee.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-white shadow-md border-r-4 border-blue-600' 
                      : 'hover:bg-white hover:shadow-sm border-r-4 border-transparent'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isActive ? committee.bg : 'bg-slate-100'} ${isActive ? committee.color : 'text-slate-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`font-bold text-lg ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                    {committee.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
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
                    <div className="p-6 sm:p-10 pb-0">
                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                        <div className={`p-4 rounded-2xl ${c.bg} ${c.color}`}>
                          <Icon className="w-10 h-10" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-extrabold text-slate-900">{c.name}</h2>
                          <p className="text-slate-500 font-medium">كل ما تحتاج معرفته عن اللجنة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="px-6 sm:px-10 pb-10">

              <div className="space-y-10">
                <section>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    أهداف اللجنة
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeDetails.goals.map((goal: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    شروط الانضمام
                  </h3>
                  <ul className="space-y-3 pl-4">
                    {activeDetails.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 text-slate-700 font-medium relative before:absolute before:-right-5 before:w-2 before:h-2 before:bg-blue-400 before:rounded-full">
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900 mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    كيفية الانضمام؟
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {activeDetails.howToJoin}
                  </p>
                  <button 
                    onClick={() => setRegistrationModalOpen(true)}
                    className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    التسجيل المباشر في نشاط أو رحلة
                  </button>
                </section>
                
                {/* Completed Activities and Reviews Section */}
                <section className="mt-12 pt-10 border-t border-slate-200">
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900 mb-2">
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                      الأنشطة المنفذة وتقييمات الطلاب
                    </h3>
                    <p className="text-sm text-slate-500">اختر النشاط الذي شاركت فيه لإضافة تقييمك لمساعدة زملائك</p>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    {activeDetails.completedActivities.map((actName: string, idx: number) => {
                      const actReviews = (reviews[activeCommittee] || []).filter(r => r.activityName === actName);
                      const avgRating = actReviews.length > 0 ? (actReviews.reduce((sum, r) => sum + r.rating, 0) / actReviews.length) : 0;
                      
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm gap-4">
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg mb-1">{actName}</h4>
                            <div className="flex items-center gap-2">
                              <StarRating initialRating={avgRating} readonly size="sm" />
                              <span className="text-xs font-semibold text-slate-500">
                                {actReviews.length > 0 ? `متوسط التقييم (${actReviews.length} مشاركات)` : 'لا توجد تقييمات بعد'}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedReviewActivity(actName);
                              setReviewModalOpen(true);
                            }}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                          >
                            <MessageSquare className="w-4 h-4" />
                            قيّم النشاط
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reviews List */}
                  {(reviews[activeCommittee] || []).length > 0 && (
                    <>
                      <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-slate-400" />
                        أحدث التعليقات
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(reviews[activeCommittee] || []).map(review => (
                          <div key={review.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{review.activityName}</h4>
                                <p className="text-xs text-slate-500 mt-1">{review.studentName} • {review.date}</p>
                              </div>
                              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                <StarRating initialRating={review.rating} readonly size="sm" />
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                                "{review.comment}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
                
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {activeDetails && (
        <ActivityRegistrationModal
          isOpen={registrationModalOpen}
          onClose={() => setRegistrationModalOpen(false)}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
        />
      )}

      {activeDetails && (
        <ActivityReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedReviewActivity('');
          }}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
          committeeId={activeCommittee}
          initialActivityName={selectedReviewActivity}
          onSubmitReview={handleAddReview}
        />
      )}
    </div>
  );
}
