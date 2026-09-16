const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityGuide.tsx', 'utf8');

const renderOld = `          {/* Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
              {committees.filter(c => c.id === activeCommittee).map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                    <div className={\`p-4 rounded-2xl \${c.bg} \${c.color}\`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900">{c.name}</h2>
                      <p className="text-slate-500 font-medium">كل ما تحتاج معرفته عن اللجنة</p>
                    </div>
                  </div>
                )
              })}`;

const renderNew = `          {/* Content */}
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
                        <div className={\`p-4 rounded-2xl \${c.bg} \${c.color}\`}>
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
              <div className="px-6 sm:px-10 pb-10">`;

if (code.includes(renderOld)) {
    code = code.replace(renderOld, renderNew);
} else {
    console.error("renderOld not found");
}

fs.writeFileSync('src/components/ActivityGuide.tsx', code);
