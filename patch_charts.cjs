const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// Insert Solidarity Charts Data inside renderOverview
const solidarityChartData = `
    const solidarityData = [
      { name: 'مقبول', value: requests.filter(r => r.status === 'approved').length, color: '#10b981' },
      { name: 'مرفوض', value: requests.filter(r => r.status === 'rejected').length, color: '#ef4444' },
      { name: 'قيد المراجعة', value: requests.filter(r => r.status === 'pending').length, color: '#f59e0b' },
    ];
`;

code = code.replace(
  `const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];`,
  `const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];\n${solidarityChartData}`
);


const newChartsHTML = `
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Solidarity Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6">حالة طلبات التكافل الاجتماعي</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={solidarityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {solidarityData.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'طالب']} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activities Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-6">إقبال الطلاب على الأنشطة (لجان الاتحاد)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="عدد الطلاب" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
`;

code = code.replace(
  `{/* Add more overview content here if needed */}`,
  newChartsHTML
);

if (code.includes(' {/* Add more overview content here if needed */}')) {
    // it wasn't replaced, let's find the closing div of the grid
}

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
