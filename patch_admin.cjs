const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `<Shield className="w-8 h-8 text-blue-500" />`,
  `<img src="/logo2.png" alt="الشعار" className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shadow-sm" />`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
