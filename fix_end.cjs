const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

code = code.replace("studentInfo.name", "studentData?.name");

// The error TS1005: ')' expected is at the very end of the file or because of mismatched brackets.
// Looking at line 459 `                  )})}                </div>` -> The map function is likely `array.map(() => { return ( ... )})`. So `})` is correct for `return (...)` inside map.
// Let's replace the whole last chunk of `StudentProfile.tsx` if needed.
// Wait, TS1005: ')' expected at 489,1 means it hit the end of the file while looking for a closing `}` or `)`.
