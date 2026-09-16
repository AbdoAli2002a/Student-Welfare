const fs = require('fs');
let code = fs.readFileSync('src/lib/auth-helpers.ts', 'utf8');

code = code.replace(
  "import { doc, setDoc, serverTimestamp } from 'firebase/firestore';",
  "import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';"
);

code = code.replace(
  "const secondaryAuth = getAuth(secondaryApp);",
  "const secondaryAuth = getAuth(secondaryApp);\nconst secondaryDb = getFirestore(secondaryApp);"
);

code = code.replace(
  "await setDoc(doc(db, 'users', uid)",
  "await setDoc(doc(secondaryDb, 'users', uid)"
);

fs.writeFileSync('src/lib/auth-helpers.ts', code);
