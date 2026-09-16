const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

// 1. Add imports
const importsOld = "import ActivityRegistrationModal from './ActivityRegistrationModal';";
const importsNew = "import ActivityRegistrationModal from './ActivityRegistrationModal';\nimport ActivityReviewModal from './ActivityReviewModal';\nimport StarRating from './StarRating';\nimport { Star, MessageSquare } from 'lucide-react';";

if (code.includes(importsOld) && !code.includes('ActivityReviewModal')) {
    code = code.replace(importsOld, importsNew);
} else if (!code.includes('ActivityReviewModal')) {
    code = "import ActivityReviewModal from './ActivityReviewModal';\nimport StarRating from './StarRating';\nimport { Star, MessageSquare } from 'lucide-react';\n" + code;
}

// 2. Add State for reviews
const stateOld = "const [registrationModalOpen, setRegistrationModalOpen] = useState(false);";
const stateNew = `const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
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
  };`;

if (code.includes(stateOld) && !code.includes('reviewModalOpen')) {
    code = code.replace(stateOld, stateNew);
}

// 3. Add Reviews Section below the howToJoin section
const endOfContentOld = `                  <button 
                    onClick={() => setRegistrationModalOpen(true)}
                    className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    التسجيل المباشر في نشاط أو رحلة
                  </button>
                </section>
              </div>`;

const endOfContentNew = `                  <button 
                    onClick={() => setRegistrationModalOpen(true)}
                    className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    التسجيل المباشر في نشاط أو رحلة
                  </button>
                </section>
                
                {/* Reviews Section */}
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
                </section>
                
              </div>`;

if (code.includes(endOfContentOld)) {
    code = code.replace(endOfContentOld, endOfContentNew);
} else {
    console.error("Could not find endOfContentOld block");
}

// 4. Add the modal at the end
const finalModalOld = `        <ActivityRegistrationModal
          isOpen={registrationModalOpen}
          onClose={() => setRegistrationModalOpen(false)}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
        />
      )}
    </div>
  );
}`;

const finalModalNew = `        <ActivityRegistrationModal
          isOpen={registrationModalOpen}
          onClose={() => setRegistrationModalOpen(false)}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
        />
      )}

      {activeDetails && (
        <ActivityReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          committeeName={committees.find(c => c.id === activeCommittee)?.name || ''}
          committeeId={activeCommittee}
          onSubmitReview={handleAddReview}
        />
      )}
    </div>
  );
}`;

if (code.includes(finalModalOld)) {
    code = code.replace(finalModalOld, finalModalNew);
} else {
    console.error("Could not find finalModalOld block");
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
