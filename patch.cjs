const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');
const search = `                ))}
              </div>
            </div>
               
          </div>
        </div>
           
        {/* Main Content */}`;
const replace = `                ))}
              </div>
            </div>
            
            {/* Export Data Section */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 bg-slate-50 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                تصدير السجل (PDF)
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-2">
                سيتضمن الملف تاريخ الأنشطة، التقييمات والنقاط.
              </p>
            </div>
               
          </div>
        </div>
           
        {/* Main Content */}`;
code = code.replace(search, replace);
fs.writeFileSync('src/components/StudentProfile.tsx', code);
