const fs = require('fs');
let code = fs.readFileSync('src/components/SolidarityForm.tsx', 'utf8');

code = code.replace(
  "import jsPDF from 'jspdf';",
  "import { jsPDF } from 'jspdf';"
);

fs.writeFileSync('src/components/SolidarityForm.tsx', code);
