const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

const committeeDetailsOld = `  const committeeDetails: Record<string, any> = {
    sports: {
      goals: ['تنمية الوعي الرياضي والصحي لدى الطلاب', 'اكتشاف المواهب الرياضية وتنميتها', 'تنظيم البطولات والدورات الرياضية'],
      requirements: ['أن يكون الطالب مقيداً بالكلية', 'الالتزام بالأخلاق الرياضية', 'الرغبة في المشاركة الفعالة'],
      howToJoin: 'يتم التقديم عبر استمارة الانضمام الإلكترونية المتاحة في بداية كل فصل دراسي، تليها اختبارات تقييم للمواهب في الألعاب المختلفة.'
    },
    artistic: {
      goals: ['صقل المواهب الفنية للطلاب (رسم، موسيقى، مسرح، غناء)', 'المشاركة في المسابقات القمية على مستوى الجامعة', 'إقامة معارض وحفلات فنية'],
      requirements: ['امتلاك موهبة فنية قابلة للتطوير', 'التفرغ الجزئي لحضور البروفات والتدريبات'],
      howToJoin: 'تعبئة نموذج الانضمام الإلكتروني، ثم الحضور إلى تجارب الأداء (Auditions) أو تقديم سابقة أعمال (Portfolio).'
    },
    cultural: {
      goals: ['رفع الوعي الثقافي والديني', 'تشجيع المواهب الأدبية (شعر، قصة، مقال)', 'إصدار المجلات وإقامة الندوات'],
      requirements: ['الاهتمام بالقراءة والمطالعة', 'مهارات التواصل والإلقاء'],
      howToJoin: 'تسجيل البيانات عبر المنصة، واجتياز المقابلة الشخصية لتقييم المهارات الثقافية والمعلومات العامة.'
    },
    scouts: {
      goals: ['غرس روح التطوع والاعتماد على النفس', 'خدمة البيئة والمجتمع', 'تنظيم المعسكرات الكشفية والتدريبية'],
      requirements: ['اللياقة البدنية المناسبة', 'حب العمل الجماعي والتطوعي', 'الالتزام بمبادئ وقوانين الكشافة'],
      howToJoin: 'الانضمام لفريق التدريب الأساسي في بداية العام لاجتياز دورة الإعداد والقبول كعضو عامل.'
    },
    social: {
      goals: ['تنظيم الرحلات والمعسكرات الترفيهية', 'تنظيم حملات التبرع بالدم والقوافل الخيرية', 'تنمية الروابط الاجتماعية بين الطلاب'],
      requirements: ['مهارات التنظيم والتخطيط', 'اللباقة وحسن التصرف', 'روح المبادرة'],
      howToJoin: 'ملء استمارة التقديم وحضور ورشة عمل تعريفية عن إدارة الأنشطة الاجتماعية والمشاركة في أول فعالية كتجربة.'
    }
  };`;

const committeeDetailsNew = `  const committeeDetails: Record<string, any> = {
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
  };`;

if (code.includes(committeeDetailsOld)) {
  code = code.replace(committeeDetailsOld, committeeDetailsNew);
} else {
  console.error("committeeDetailsOld not found");
}

const stateOld = `  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  const [reviews, setReviews] = useState<Record<string, {id: number, studentName: string, activityName: string, rating: number, comment: string, date: string}[]>>({`;
const stateNew = `  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewActivity, setSelectedReviewActivity] = useState<string>('');
  
  const [reviews, setReviews] = useState<Record<string, {id: number, studentName: string, activityName: string, rating: number, comment: string, date: string}[]>>({`;

if (code.includes(stateOld)) {
  code = code.replace(stateOld, stateNew);
} else {
  console.error("stateOld not found");
}

// Now replace the Reviews Section
const reviewsSectionOld = `                {/* Reviews Section */}
                <section className="mt-12 pt-10 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900 mb-2">
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                        سجل الأنشطة وتقييمات الطلاب
                      </h3>
                      {reviews[activeCommittee]?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <StarRating 
                            initialRating={
                              reviews[activeCommittee].reduce((acc, curr) => acc + curr.rating, 0) / reviews[activeCommittee].length
                            } 
                            readonly 
                          />
                          <span className="text-sm text-slate-500 font-semibold">
                            (متوسط التقييم من {reviews[activeCommittee].length} طالب)
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">لا توجد تقييمات حالياً لهذه اللجنة.</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setReviewModalOpen(true)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200 font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      إضافة تقييم
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(reviews[activeCommittee] || []).map(review => (
                      <div key={review.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800">{review.activityName}</h4>
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
                </section>`;

const reviewsSectionNew = `                {/* Completed Activities and Reviews Section */}
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
                                {actReviews.length > 0 ? \`متوسط التقييم (\${actReviews.length} مشاركات)\` : 'لا توجد تقييمات بعد'}
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
                </section>`;

if (code.includes(reviewsSectionOld)) {
  code = code.replace(reviewsSectionOld, reviewsSectionNew);
} else {
  console.error("reviewsSectionOld not found");
}

const modalPropsOld = `<ActivityReviewModal 
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
        committeeId={activeCommittee}
        onSubmitReview={handleAddReview}
      />`;
const modalPropsNew = `<ActivityReviewModal 
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedReviewActivity('');
        }}
        committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
        committeeId={activeCommittee}
        initialActivityName={selectedReviewActivity}
        onSubmitReview={handleAddReview}
      />`;

if (code.includes(modalPropsOld)) {
  code = code.replace(modalPropsOld, modalPropsNew);
} else {
  console.error("modalPropsOld not found");
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
