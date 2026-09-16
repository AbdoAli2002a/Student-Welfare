const fs = require('fs');

// Fix SolidarityForm
let code = fs.readFileSync('src/components/SolidarityForm.tsx', 'utf8');

// The issue is an extra `</div>` or missing one around line 173-176.
// Let's just fix it by replacing the block.
code = code.replace(
  `            <p className="text-xs text-slate-500">هذا الإيصال يعتبر مستند إثبات لتقديم الطلب فقط، ولا يعتبر قبولاً نهائياً إلا بعد موافقة اللجنة المختصة.</p>
          </div>
        </div>
        
          <div className="mt-8 pt-6 border-t border-dashed border-slate-300 hidden print:flex justify-between text-sm">
            <p className="font-bold">توقيع الطالب: ...........................</p>
            <p className="font-bold">توقيع الموظف المختص: ...........................</p>
          </div>
        </div>`,
  `            <p className="text-xs text-slate-500">هذا الإيصال يعتبر مستند إثبات لتقديم الطلب فقط، ولا يعتبر قبولاً نهائياً إلا بعد موافقة اللجنة المختصة.</p>
          </div>
        </div>`
);

fs.writeFileSync('src/components/SolidarityForm.tsx', code);

// Fix StudentProfile
let profCode = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// The regex I used earlier:
// profileCode.replace(/const q = query\(collection[\s\S]*?getDocs\(q\);/g, "");
// Left behind syntax errors. Let's see what is at the end of StudentProfile.tsx

