const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

code = code.replace(
  "useState<'activities' | 'trips' | 'solidarity'>('activities')",
  "useState<'activities' | 'trips' | 'solidarity' | 'history'>('activities')"
);

code = code.replace(
  `              <button 
                onClick={() => setActiveTab('solidarity')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'solidarity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                طلبات التكافل الاجتماعي
              </button>`,
  `              <button 
                onClick={() => setActiveTab('solidarity')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'solidarity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                طلبات التكافل الاجتماعي
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                سجل النشاط
              </button>`
);

// We need to add the view for `activeTab === 'history'`
// Let's find the main content block
// It's structured as:
// {activeTab === 'activities' ? ( ... ) : activeTab === 'trips' ? ( ... ) : ( ... solidarity requests ... )}
// We'll replace the last `)` with `: activeTab === 'history' ? ( ... history code ... ) : null}` 
// Actually, it's safer to inject it before `) : (` which is for solidarity.

