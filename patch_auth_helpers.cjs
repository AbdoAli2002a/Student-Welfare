const fs = require('fs');
let code = fs.readFileSync('src/lib/auth-helpers.ts', 'utf8');

code = code.replace(
  "import { initializeApp } from 'firebase/app';",
  "import { initializeApp, getApps, getApp } from 'firebase/app';"
);

code = code.replace(
  "const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');",
  "const secondaryApp = getApps().find(app => app.name === 'SecondaryApp') ? getApp('SecondaryApp') : initializeApp(firebaseConfig, 'SecondaryApp');"
);

fs.writeFileSync('src/lib/auth-helpers.ts', code);
