const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
code = code.replace('export default function Navbar({', 'export default function Navbar({');
code = code.replace('<nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm"', '<nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden"');
fs.writeFileSync('src/components/Navbar.tsx', code);
