const fs = require('fs');
let code = fs.readFileSync('src/components/StudentAccounts.tsx', 'utf8');

code = code.replace(
  "import { Download, UserPlus, Search, Key, CheckCircle } from 'lucide-react';",
  "import { Download, UserPlus, Search, Key, CheckCircle } from 'lucide-react';\nimport { createStudentAccount } from '../lib/auth-helpers';\nimport { collection, query, where, getDocs } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
);

code = code.replace(
  `  const [students, setStudents] = useState([
    { id: '2023001', name: 'أحمد محمد علي', username: 'ahmed.m', level: 'الفرقة الثالثة' },
    { id: '2023002', name: 'سارة خالد السيد', username: 'sara.k', level: 'الفرقة الثانية' },
    { id: '2023003', name: 'محمود طارق سعيد', username: 'mahmoud.t', level: 'الفرقة الرابعة' },
  ]);`,
  `  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.data().studentId || doc.id, ...doc.data() }));
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);`
);

code = code.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

code = code.replace(
  `  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const id = \`20230\${Math.floor(Math.random() * 100) + 10}\`;
    setStudents([{ id, ...newStudent }, ...students]);
    setIsAdding(false);
    setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
  };`,
  `  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentId = \`20230\${Math.floor(Math.random() * 100) + 10}\`;
      await createStudentAccount({ ...newStudent, studentId });
      
      // Update local state for immediate feedback
      setStudents([{ id: studentId, ...newStudent }, ...students]);
      setIsAdding(false);
      setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
    } catch (error: any) {
      alert('خطأ في إنشاء الحساب: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };`
);

code = code.replace(
  "                  <CheckCircle className=\"w-4 h-4\" />\n                  إنشاء الحساب\n                </button>",
  "                  <CheckCircle className=\"w-4 h-4\" />\n                  {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}\n                </button>"
);

fs.writeFileSync('src/components/StudentAccounts.tsx', code);
