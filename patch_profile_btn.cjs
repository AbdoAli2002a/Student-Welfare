const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const target = `              <button 
                onClick={() => setActiveTab('solidarity')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'solidarity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                طلبات التكافل الاجتماعي
              </button>`;

const replacement = target + `
              <button 
                onClick={() => setActiveTab('history')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                سجل النشاط
              </button>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/StudentProfile.tsx', code);
    console.log("Success");
} else {
    // try a more robust approach
    const lines = code.split('\\n');
    let out = [];
    for (let i = 0; i < lines.length; i++) {
        out.push(lines[i]);
        if (lines[i].includes('طلبات التكافل الاجتماعي') && lines[i+1] && lines[i+1].includes('</button>')) {
             out.push(lines[i+1]);
             out.push(`              <button 
                onClick={() => setActiveTab('history')}
                className={\`font-bold pb-4 -mb-5 border-b-2 transition-colors whitespace-nowrap \${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}\`}
              >
                سجل النشاط
              </button>`);
             i++;
        }
    }
    fs.writeFileSync('src/components/StudentProfile.tsx', out.join('\\n'));
    console.log("Success fallback");
}
