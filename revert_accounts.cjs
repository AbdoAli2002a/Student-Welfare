const fs = require('fs');
let code = fs.readFileSync('src/components/StudentAccounts.tsx', 'utf8');

code = code.replace(
  "import { createStudentAccount } from '../lib/auth-helpers';\nimport { collection, query, where, getDocs } from 'firebase/firestore';\nimport { db } from '../lib/firebase';",
  ""
);

code = code.replace(
  "const [students, setStudents] = useState<any[]>([]);",
  "const [students, setStudents] = useState<any[]>([\n    { id: '20230001', name: 'أحمد محمود', username: 'ahmed.m', level: 'الفرقة الثالثة' },\n    { id: '20230045', name: 'فاطمة علي', username: 'fatma.a', level: 'الفرقة الأولى' },\n    { id: '20220120', name: 'محمود سيد', username: 'mahmoud.s', level: 'الفرقة الرابعة' },\n  ]);"
);

code = code.replace(
  `  useEffect(() => {
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
  }, []);`,
  ""
);

const newHandleAdd = `  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentId = '2024' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      // await createStudentAccount({ ...newStudent, studentId });
      
      setStudents([{ id: studentId, ...newStudent }, ...students]);
      setIsAdding(false);
      setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
    } catch (error: any) {
      alert('خطأ في إنشاء الحساب: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };`;

// We just commented out createStudentAccount above, but wait, the exact regex replacement would be better.
code = code.replace("await createStudentAccount({ ...newStudent, studentId });", "// Local state addition");

fs.writeFileSync('src/components/StudentAccounts.tsx', code);
