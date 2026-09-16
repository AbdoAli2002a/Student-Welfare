import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Key, Shield, CheckCircle, Download } from 'lucide-react';


export default function StudentAccounts() {
  const [students, setStudents] = useState<any[]>([
    { id: '20230001', name: 'أحمد محمود', username: 'ahmed.m', level: 'الفرقة الثالثة' },
    { id: '20230045', name: 'فاطمة علي', username: 'fatma.a', level: 'الفرقة الأولى' },
    { id: '20220120', name: 'محمود سيد', username: 'mahmoud.s', level: 'الفرقة الرابعة' },
  ]);



  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    username: '',
    password: '',
    level: 'الفرقة الأولى'
  });

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.id.includes(searchTerm) || s.username.includes(searchTerm)
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentId = '2024' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      // Local state addition
      
      setStudents([{ id: studentId, ...newStudent }, ...students]);
      setIsAdding(false);
      setNewStudent({ name: '', username: '', password: '', level: 'الفرقة الأولى' });
    } catch (error: any) {
      alert('خطأ في إنشاء الحساب: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['الرقم الجامعي', 'اسم الطالب', 'اسم المستخدم', 'الفرقة الدراسية'];
    const csvContent = [
      headers.join(','),
      ...students.map(s => `${s.id},${s.name},${s.username},${s.level}`)
    ].join('\n');

    // Add BOM for Excel Arabic support
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_accounts_and_activity.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">إدارة حسابات الطلاب</h3>
          <p className="text-sm text-slate-500">إنشاء وإدارة حسابات الطلاب للوصول لخدمات المنصة.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">إنشاء حساب طالب</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="البحث بالاسم، اسم المستخدم، أو الرقم الجامعي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-600 whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">الرقم الجامعي</th>
                <th scope="col" className="px-6 py-4 font-bold">اسم الطالب</th>
                <th scope="col" className="px-6 py-4 font-bold">اسم المستخدم</th>
                <th scope="col" className="px-6 py-4 font-bold">الفرقة الدراسية</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">{student.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-slate-700">{student.username}</td>
                  <td className="px-6 py-4">{student.level}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs">
                      <Key className="w-4 h-4" />
                      إعادة تعيين كلمة المرور
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                إنشاء حساب طالب جديد
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-lg p-1 transition-colors border border-slate-200"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الطالب الرباعي</label>
                <input 
                  required 
                  type="text" 
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  placeholder="مثال: محمد أحمد علي محمود"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم المستخدم</label>
                <input 
                  required 
                  type="text" 
                  value={newStudent.username}
                  onChange={e => setNewStudent({...newStudent, username: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-left" 
                  dir="ltr"
                  placeholder="mohamed.ahmed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">كلمة المرور</label>
                <input 
                  required 
                  type="password" 
                  value={newStudent.password}
                  onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-left" 
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الفرقة الدراسية</label>
                <select 
                  value={newStudent.level}
                  onChange={e => setNewStudent({...newStudent, level: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="الفرقة الأولى">الفرقة الأولى</option>
                  <option value="الفرقة الثانية">الفرقة الثانية</option>
                  <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                  <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
