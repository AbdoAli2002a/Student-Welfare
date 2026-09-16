const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPatchStatus = `app.patch("/api/solidarity-requests/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const reqIndex = solidarityRequests.findIndex(r => r.id === id);
    if (reqIndex > -1) {
      solidarityRequests[reqIndex].status = status;
      
      // Create notification
      const studentName = solidarityRequests[reqIndex].name;
      let statusText = status === 'approved' ? 'مقبول' : status === 'rejected' ? 'مرفوض' : 'قيد المراجعة';
      let notifType = status === 'approved' ? 'success' : status === 'rejected' ? 'warning' : 'info';
      
      notifications.push({
        id: Date.now(),
        title: 'تحديث حالة طلب التكافل',
        content: 'مرحباً ' + studentName + '، تم تحديث حالة طلب التكافل الخاص بك إلى: ' + statusText + '.',
        type: notifType,
        date: new Date().toISOString(),
        read: false
      });

      res.json({ success: true, request: solidarityRequests[reqIndex] });
    } else {
      res.status(404).json({ error: "الطلب غير موجود" });
    }
  });`;

const newPatchStatus = `app.patch("/api/solidarity-requests/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    
    const reqIndex = solidarityRequests.findIndex(r => r.id === id);
    if (reqIndex > -1) {
      solidarityRequests[reqIndex].status = status;
      solidarityRequests[reqIndex].note = note;
      
      // Create notification
      const studentName = solidarityRequests[reqIndex].name;
      let statusText = status === 'approved' ? 'مقبول' : status === 'rejected' ? 'مرفوض' : 'قيد المراجعة';
      let notifType = status === 'approved' ? 'success' : status === 'rejected' ? 'warning' : 'info';
      let contentMsg = 'مرحباً ' + studentName + '، تم تحديث حالة طلب التكافل الخاص بك إلى: ' + statusText + '.';
      if (note) {
          contentMsg += '\\nملاحظة الإدارة: ' + note;
      }
      
      notifications.push({
        id: Date.now(),
        title: 'تحديث حالة طلب التكافل',
        content: contentMsg,
        type: notifType,
        date: new Date().toISOString(),
        read: false
      });

      res.json({ success: true, request: solidarityRequests[reqIndex] });
    } else {
      res.status(404).json({ error: "الطلب غير موجود" });
    }
  });`;

if(code.includes(oldPatchStatus)) {
    code = code.replace(oldPatchStatus, newPatchStatus);
}

fs.writeFileSync('server.ts', code);
