const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// just comment it out
code = code.replace("  useEffect(() => {\n    \n  const [activityHistory", "  // removed useEffect\n  const [activityHistory");

// wait, let's use a simpler regex
code = code.replace(/useEffect\(\(\) => \{\s+const \[activityHistory/g, "const [activityHistory");

fs.writeFileSync('src/components/StudentProfile.tsx', code);
