const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const oldState = `  const [activityHistory, setActivityHistory] = useState([
    { id: 1, title: 'معرض الفنون التشكيلية', date: '١٢ أكتوبر ٢٠٢٣', status: 'completed', type: 'اللجنة الفنية', rating: 5 },
    { id: 2, title: 'مسابقة الشطرنج السنوية', date: '٥ نوفمبر ٢٠٢٣', status: 'completed', type: 'اللجنة الرياضية', rating: undefined },
    { id: 3, title: 'حملة التبرع بالدم', date: '٢٠ نوفمبر ٢٠٢٣', status: 'upcoming', type: 'لجنة الجوالة والخدمة العامة' }
  ]);

  const [tripsHistory, setTripsHistory] = useState([
    { id: 1, title: 'رحلة مدينة الأقصر وأسوان', date: '٢٥ يناير ٢٠٢٣', status: 'completed', rating: 5 },
    { id: 2, title: 'معسكر إعداد القادة', date: '١٥ يوليو ٢٠٢٣', status: 'completed', rating: undefined }
  ]);`;

const newState = `  const [activityHistory, setActivityHistory] = useState([
    { id: 1, title: 'معرض الفنون التشكيلية', date: '١٢ أكتوبر ٢٠٢٣', status: 'completed', type: 'اللجنة الفنية', rating: 5, hasCertificate: true },
    { id: 2, title: 'مسابقة الشطرنج السنوية', date: '٥ نوفمبر ٢٠٢٣', status: 'completed', type: 'اللجنة الرياضية', rating: undefined, hasCertificate: false },
    { id: 3, title: 'حملة التبرع بالدم', date: '٢٠ نوفمبر ٢٠٢٣', status: 'upcoming', type: 'لجنة الجوالة والخدمة العامة' }
  ]);

  const [tripsHistory, setTripsHistory] = useState([
    { id: 1, title: 'رحلة مدينة الأقصر وأسوان', date: '٢٥ يناير ٢٠٢٣', status: 'completed', rating: 5, hasCertificate: true },
    { id: 2, title: 'معسكر إعداد القادة', date: '١٥ يوليو ٢٠٢٣', status: 'completed', rating: undefined, hasCertificate: true }
  ]);`;

code = code.replace(oldState, newState);

const oldHistoryTab = `              ) : activeTab === 'history' ? (
                <div className="space-y-4">
                  {[
                    ...activityHistory.filter(a => a.status === 'completed').map(a => ({...a, category: 'نشاط', icon: <CheckCircle className="w-6 h-6" />})),
                    ...tripsHistory.filter(t => t.status === 'completed').map(t => ({...t, category: 'رحلة', icon: <MapPin className="w-6 h-6" />}))
                  ].map((item, idx) => (
                    <div key={\`hist-\${idx}\`} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className="p-3 rounded-full bg-slate-100 text-slate-600">
                        {item.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <span className="text-xs px-2 py-1 rounded font-semibold bg-slate-200 text-slate-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {item.date}
                          {item.type && <span>• {item.type}</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activityHistory.filter(a => a.status === 'completed').length === 0 && tripsHistory.filter(t => t.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة أو رحلات سابقة</div>
                  )}
                </div>
              ) : (`;

const newHistoryTab = `              ) : activeTab === 'history' ? (
                <div className="space-y-4">
                  {[
                    ...activityHistory.filter(a => a.status === 'completed').map(a => ({...a, category: 'نشاط', icon: <CheckCircle className="w-6 h-6" />})),
                    ...tripsHistory.filter(t => t.status === 'completed').map(t => ({...t, category: 'رحلة', icon: <MapPin className="w-6 h-6" />}))
                  ].map((item, idx) => (
                    <div key={\`hist-\${idx}\`} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4 flex-grow w-full">
                        <div className="p-3 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <span className="text-xs px-2 py-1 rounded font-semibold bg-slate-200 text-slate-700 sm:hidden">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {item.date}
                            {item.type && <span>• {item.type}</span>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-200">
                        <span className="text-xs px-2 py-1 rounded font-semibold bg-slate-200 text-slate-700 hidden sm:block">
                          {item.category}
                        </span>
                        {item.hasCertificate && (
                          <button 
                            onClick={() => {
                              setSelectedCertificate({ title: item.title, date: item.date });
                              setCertificateModalOpen(true);
                            }}
                            className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                            عرض الشهادة
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {activityHistory.filter(a => a.status === 'completed').length === 0 && tripsHistory.filter(t => t.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة أو رحلات سابقة</div>
                  )}
                </div>
              ) : (`;

if (code.includes(oldHistoryTab)) {
    code = code.replace(oldHistoryTab, newHistoryTab);
} else {
    console.error("oldHistoryTab not found");
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
