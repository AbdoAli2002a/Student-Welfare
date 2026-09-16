const fs = require('fs');
let code = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');

code = code.replace(
  `    // Actual Firebase Login
    try {
      const email = \`\${username}@student.edu.eg\`;
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      onLogin(username);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setIsLoading(false);
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }`,
  `    // Local mock login
    setTimeout(() => {
      setIsLoading(false);
      if (password.length >= 6) {
        onLogin(username);
        setUsername('');
        setPassword('');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    }, 1000);`
);

fs.writeFileSync('src/components/LoginModal.tsx', code);
