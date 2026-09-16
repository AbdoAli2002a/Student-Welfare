const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  `<div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">\n            E\n          </div>`,
  `<div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm overflow-hidden border border-slate-100 p-0.5">\n            <img src="/logo2.png" alt="شعار الكلية" className="w-full h-full object-contain rounded-full" />\n          </div>`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
