const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

code = code.replace(
  `                  )})}
                </div>`,
  `                  );
                  })}
                </div>`
);

code = code.replace("studentInfo.name", "studentData?.name");

fs.writeFileSync('src/components/StudentProfile.tsx', code);
