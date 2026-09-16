const fs = require('fs');
let code = fs.readFileSync('src/components/LoginModal.tsx', 'utf8');

code = code.replace(
  "import { User, Lock, LogIn, X, AlertCircle } from 'lucide-react';",
  "import { User, Lock, LogIn, X, AlertCircle } from 'lucide-react';\nimport { signInWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from '../lib/firebase';"
);

code = code.replace(
  `    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
      setIsLoading(false);
      // في تطبيق حقيقي، سيتم التحقق من البيانات هنا
      onLogin(username);
      setUsername('');
      setPassword('');
    }, 1000);`,
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
    }`
);

code = code.replace(
  "const handleSubmit = (e: React.FormEvent) => {",
  "const handleSubmit = async (e: React.FormEvent) => {"
);

fs.writeFileSync('src/components/LoginModal.tsx', code);
