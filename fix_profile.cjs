const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

const target = `                  ))}
                </div>
              ) : activeTab === 'trips' ? (`;

const replace = `                  ))}
                </div>
                </div>
              ) : activeTab === 'trips' ? (`;

if (code.includes(target)) {
    code = code.replace(target, replace);
    fs.writeFileSync('src/components/StudentProfile.tsx', code);
    console.log("Fixed!");
} else {
    console.log("Target not found");
}
