const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const historyRender = `              ) : activeTab === 'history' ? (
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

code = code.replace(
  `              ) : (
                <div className="space-y-6">
                  {solidarityRequests.map(request => {`,
  historyRender + `
                <div className="space-y-6">
                  {solidarityRequests.map(request => {`
);

fs.writeFileSync('src/components/StudentProfile.tsx', code);
