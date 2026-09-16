const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/register-activity", (req, res) => {
    const { activityName, committee, studentId } = req.body;
    
    // Add to notifications
    notifications.push({
      id: Date.now(),
      title: 'تأكيد التسجيل في النشاط',
      content: \`تم تسجيلك بنجاح في \${activityName} التابع لـ \${committee}. سيتم التواصل معك قريباً بالتفاصيل.\`,
      type: 'success',
      date: new Date().toISOString(),
      read: false
    });

    res.json({ success: true, message: "تم التسجيل بنجاح وتم إرسال إشعار" });
  });

  // Get all requests
`;

code = code.replace("  // Get all requests", newRoute);

fs.writeFileSync('server.ts', code);
