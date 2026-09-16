const fs = require('fs');
let code = fs.readFileSync('src/components/ActivityReviewModal.tsx', 'utf8');

code = code.replace(/\\`/g, '\`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/ActivityReviewModal.tsx', code);
