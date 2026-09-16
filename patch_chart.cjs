const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const importsOld = "import DigitalIdCardModal from './DigitalIdCardModal';";
const importsNew = "import DigitalIdCardModal from './DigitalIdCardModal';\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';";

if (code.includes(importsOld) && !code.includes('recharts')) {
    code = code.replace(importsOld, importsNew);
}

const dataInsertPoint = "const [activityHistory, setActivityHistory] = useState([";
const dataCode = `  const attendanceData = [
    { name: 'الرياضية', student: 5, average: 3 },
    { name: 'الفنية', student: 2, average: 4 },
    { name: 'الثقافية', student: 4, average: 2 },
    { name: 'الاجتماعية', student: 3, average: 3.5 },
    { name: 'الجوالة', student: 1, average: 2 },
  ];

  `;

if (code.includes(dataInsertPoint) && !code.includes('attendanceData')) {
    code = code.replace(dataInsertPoint, dataCode + dataInsertPoint);
}

const chartHtml = `              {activeTab === 'activities' ? (
                <div className="space-y-6">
                  {/* Attendance Chart */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      معدل حضورك للأنشطة مقارنة بمتوسط الطلاب
                    </h4>
                    <div className="h-64 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="student" name="حضورك" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                          <Bar dataKey="average" name="متوسط الكلية" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                  {activityHistory.map(activity => (`;

const targetHtml = `              {activeTab === 'activities' ? (
                <div className="space-y-4">
                  {activityHistory.map(activity => (`;

if (code.includes(targetHtml)) {
    code = code.replace(targetHtml, chartHtml);
} else {
    console.error("targetHtml not found");
}

const bottomHtml = `                  {activityHistory.length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة حالياً</div>
                  )}
                </div>
              ) : activeTab === 'trips' ? (`;

const bottomTarget = `                  {activityHistory.length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة حالياً</div>
                  )}
                </div>
              ) : activeTab === 'trips' ? (`;

if (code.includes(bottomTarget)) {
    // Already wrapped in a div space-y-6, so we need to close the inner div space-y-4
    const bottomNew = `                  {activityHistory.length === 0 && (
                    <div className="text-center py-8 text-slate-500">لا يوجد سجل أنشطة حالياً</div>
                  )}
                  </div>
                </div>
              ) : activeTab === 'trips' ? (`;
    code = code.replace(bottomTarget, bottomNew);
} else {
    console.log("Could not find bottom string exactly, trying regex");
    // fallback if exact string differs
    const fallbackTarget = `                  )}
                </div>
              ) : activeTab === 'trips' ? (`;
    const fallbackNew = `                  )}
                  </div>
                </div>
              ) : activeTab === 'trips' ? (`;
    code = code.replace(fallbackTarget, fallbackNew);
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
