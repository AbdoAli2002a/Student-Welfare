const fs = require('fs');
let code = fs.readFileSync('src/components/StudentAccounts.tsx', 'utf8');

// First replace the original useState with useEffect included
if (!code.includes("import { createStudentAccount } from '../lib/auth-helpers';")) {
  code = code.replace(
    "import { Users, UserPlus, Search, Key, Shield, CheckCircle, Download } from 'lucide-react';",
    "import { Users, UserPlus, Search, Key, Shield, CheckCircle, Download } from 'lucide-react';\nimport { createStudentAccount } from '../lib/auth-helpers';\nimport { collection, query, where, getDocs } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
  );
}

// Ensure isSubmitting is defined
if (!code.includes("const [isSubmitting, setIsSubmitting] = useState(false);")) {
  code = code.replace(
    "const [isAdding, setIsAdding] = useState(false);",
    "const [isAdding, setIsAdding] = useState(false);\n  const [isSubmitting, setIsSubmitting] = useState(false);"
  );
}

// Replace the mock fetch with Firebase fetch
if (!code.includes("const fetchStudents = async () => {")) {
  code = code.replace(
    /const \[students, setStudents\] = useState\(\[[\s\S]*?\]\);/,
    `const [students, setStudents] = useState<any[]>([]);

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
}

// Replace handleAddStudent with the firebase one
const oldHandleAdd = `  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = '2024' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setStudents([...students, { id: newId, name: newStudent.name, username: newStudent.username, level: newStudent.level }]);
    setIsAdding(false);
    setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
  };`;

const newHandleAdd = `  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentId = '2024' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      await createStudentAccount({ ...newStudent, studentId });
      
      setStudents([{ id: studentId, ...newStudent }, ...students]);
      setIsAdding(false);
      setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
    } catch (error: any) {
      alert('خطأ في إنشاء الحساب: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };`;

if (code.includes(oldHandleAdd)) {
  code = code.replace(oldHandleAdd, newHandleAdd);
} else {
  console.log("Could not find old handleAddStudent to replace, maybe it's already replaced or slightly different format.");
  // try regex
  code = code.replace(
    /const handleAddStudent = \(e: React\.FormEvent\) => \{[\s\S]*?level: 'الفرقة الأولى' \}\);\s*\};/,
    newHandleAdd
  );
}

fs.writeFileSync('src/components/StudentAccounts.tsx', code);
