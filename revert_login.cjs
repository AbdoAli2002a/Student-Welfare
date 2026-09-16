const fs = require('fs');
let code = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');

code = code.replace(
  "import { signInWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from '../lib/firebase';",
  ""
);

code = code.replace(
  `      // try firebase auth first
      const email = \`\${username}@student.edu.eg\`;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin(username);
        setUsername('');
        setPassword('');
        return;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          // fallback to local for demo if firebase fails
        }
      }`,
  ""
);

fs.writeFileSync('src/components/LoginModal.tsx', code);
