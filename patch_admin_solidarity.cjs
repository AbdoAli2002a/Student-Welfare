const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const oldHandleUpdate = `  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(\`/api/solidarity-requests/\${id}/status\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('فشل في تحديث حالة الطلب');
      
      const { request } = await response.json();
      
      setRequests(prev => prev.map(req => req.id === id ? request : req));
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    } finally {
      setUpdatingId(null);
    }
  };`;

const newHandleUpdate = `  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const note = prompt('أضف ملاحظة للطالب (اختياري):');
    setUpdatingId(id);
    try {
      const response = await fetch(\`/api/solidarity-requests/\${id}/status\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });
      
      if (!response.ok) throw new Error('فشل في تحديث حالة الطلب');
      
      const { request } = await response.json();
      
      setRequests(prev => prev.map(req => req.id === id ? request : req));
    } catch (err) {
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    } finally {
      setUpdatingId(null);
    }
  };`;

if(code.includes(oldHandleUpdate)) {
    code = code.replace(oldHandleUpdate, newHandleUpdate);
}

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
