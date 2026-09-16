const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const oldSolidarityTab = `                <div className="space-y-6">
                  {solidarityRequests.map(request => {
                    const stepIndex = getStepIndex(request.status);
                    
                    return (
                    <div key={request.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">`;

const newSolidarityTab = `                <div className="space-y-0 relative before:hidden sm:before:block before:absolute before:right-[15px] before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200 before:z-0">
                  {solidarityRequests.map((request, index) => {
                    const stepIndex = getStepIndex(request.status);
                    const isCompleted = stepIndex >= 3;
                    
                    return (
                    <div key={request.id} className="flex gap-4 sm:gap-6 relative z-10 mb-8 last:mb-0">
                      {/* Timeline Dot (Hidden on small screens for better space, visible on SM+) */}
                      <div className="hidden sm:flex flex-col items-center pt-6">
                        <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${isCompleted ? 'bg-green-500' : 'bg-blue-500'} ring-4 ring-slate-50 shadow-sm z-10\`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="flex-1">
                        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                          {/* Decorative Timeline Edge on Mobile */}
                          <div className={\`sm:hidden absolute top-0 right-0 w-1 h-full \${isCompleted ? 'bg-green-500' : 'bg-blue-500'}\`}></div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">`;

if (code.includes(oldSolidarityTab)) {
    code = code.replace(oldSolidarityTab, newSolidarityTab);
} else {
    console.error("oldSolidarityTab not found!");
}

// We also need to add closing divs to balance the extra <div className="flex-1"> we added.
// Let's find the end of the map function for the solidarity tab.
const oldSolidarityEnd = `                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>`;

const newSolidarityEnd = `                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  );
                  })}
                </div>`;

if (code.includes(oldSolidarityEnd)) {
    code = code.replace(oldSolidarityEnd, newSolidarityEnd);
} else {
    console.error("oldSolidarityEnd not found!");
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
