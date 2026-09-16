const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

code = code.replace("studentData?.name", "studentInfo.name");

fs.writeFileSync('src/components/StudentProfile.tsx', code);
