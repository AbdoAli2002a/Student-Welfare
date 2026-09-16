const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const notificationsCode = `
  // --- Notifications API ---
  let notifications = [
    { id: 1, title: 'قبول طلب التكافل', content: 'تم قبول طلب التكافل الاجتماعي الخاص بك للفصل الدراسي الحالي.', type: 'success', date: new Date().toISOString(), read: false },
    { id: 2, title: 'تأكيد حجز رحلة الأقصر', content: 'برجاء التوجه لرعاية الشباب لتسديد رسوم الرحلة في موعد أقصاه الخميس القادم.', type: 'info', date: new Date(Date.now() - 3600000).toISOString(), read: false }
  ];

  app.get("/api/notifications", (req, res) => {
    res.json(notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });

  app.post("/api/notifications/mark-all-read", (req, res) => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({ success: true });
  });

  app.patch("/api/notifications/:id/read", (req, res) => {
    const id = parseInt(req.params.id);
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/notifications/:id", (req, res) => {
    const id = parseInt(req.params.id);
    notifications = notifications.filter(n => n.id !== id);
    res.json({ success: true });
  });
`;

if (!code.includes('/api/notifications')) {
  code = code.replace('// 3. التكافل الاجتماعي (Social Solidarity API)', notificationsCode + '\n  // 3. التكافل الاجتماعي (Social Solidarity API)');
}

// Update solidarity status patch to push notification
const oldPatchStatus = `app.patch("/api/solidarity-requests/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const reqIndex = solidarityRequests.findIndex(r => r.id === id);
    if (reqIndex > -1) {
      solidarityRequests[reqIndex].status = status;
      res.json({ success: true, request: solidarityRequests[reqIndex] });
    } else {
      res.status(404).json({ error: "الطلب غير موجود" });
    }
  });`;

const newPatchStatus = `app.patch("/api/solidarity-requests/:id/status", (req, res) => {
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

if (code.includes(oldPatchStatus)) {
  code = code.replace(oldPatchStatus, newPatchStatus);
}

fs.writeFileSync('server.ts', code);
