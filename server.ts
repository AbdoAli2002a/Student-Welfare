import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;


  app.use(express.json());

  // === RESTful API Endpoints ===

  // 1. الطلاب (Students API)
  app.get("/api/students", (req, res) => {
    res.json({ message: "جلب قائمة الطلاب" });
  });

  // Mock database for activities
  let activities = [
    { 
      id: "1", 
      title: "معرض الفنون التشكيلية", 
      description: "معرض سنوي يضم إبداعات الطلاب في مجالات الرسم، النحت، والتصوير الفوتوغرافي.",
      committee: "artistic",
      date: "2024-11-15",
      location: "قاعة المعارض الكبرى",
      status: "upcoming",
      rating: 0,
      reviewsCount: 0
    },
    { 
      id: "2", 
      title: "دوري كرة القدم الخماسي", 
      description: "بطولة الكلية لكرة القدم الخماسي بين الأقسام المختلفة بمشاركة أكثر من 20 فريقاً.",
      committee: "sports",
      date: "2024-10-20",
      location: "ملاعب الكلية",
      status: "ongoing",
      rating: 0,
      reviewsCount: 0
    },
    { 
      id: "3", 
      title: "الندوة الثقافية الكبرى", 
      description: "ندوة حوارية مفتوحة حول التنمية المستدامة والوعي الكربوني للشباب الجامعي.",
      committee: "cultural",
      date: "2024-09-05",
      location: "مدرج الاحتفالات",
      status: "completed",
      rating: 4.5,
      reviewsCount: 124
    },
    { 
      id: "4", 
      title: "معسكر الجوالة والخدمة العامة", 
      description: "معسكر تدريبي لتنمية مهارات الاعتماد على النفس والعمل التطوعي لخدمة البيئة.",
      committee: "scouting",
      date: "2024-12-01",
      location: "المخيم الكشفي بالجامعة",
      status: "upcoming",
      rating: 0,
      reviewsCount: 0
    }
  ];

  // 2. الأنشطة والفعاليات (Activities API)
  app.get("/api/activities", (req, res) => {
    res.json(activities);
  });

  app.post("/api/activities", (req, res) => {
    const newActivity = {
      id: Date.now().toString(),
      title: req.body.title,
      description: req.body.description,
      committee: req.body.committee,
      date: req.body.date,
      location: req.body.location,
      status: req.body.status || 'upcoming',
      rating: 0,
      reviewsCount: 0
    };
    activities.unshift(newActivity); // Add to the beginning
    res.status(201).json({ success: true, activity: newActivity });
  });

  app.put("/api/activities/:id", (req, res) => {
    const { id } = req.params;
    const activityIndex = activities.findIndex(a => a.id === id);
    if (activityIndex > -1) {
      activities[activityIndex] = {
        ...activities[activityIndex],
        title: req.body.title,
        description: req.body.description,
        committee: req.body.committee,
        date: req.body.date,
        location: req.body.location,
        status: req.body.status
      };
      res.json({ success: true, activity: activities[activityIndex] });
    } else {
      res.status(404).json({ error: "Activity not found" });
    }
  });

  app.post("/api/activities/:id/rate", (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const activityIndex = activities.findIndex(a => a.id === id);
    if (activityIndex > -1 && rating >= 1 && rating <= 5) {
      const activity = activities[activityIndex];
      const newReviewsCount = activity.reviewsCount + 1;
      const newRating = ((activity.rating * activity.reviewsCount) + rating) / newReviewsCount;
      activities[activityIndex].rating = newRating;
      activities[activityIndex].reviewsCount = newReviewsCount;
      res.json({ success: true, activity: activities[activityIndex] });
    } else {
      res.status(404).json({ error: "Activity not found or invalid rating" });
    }
  });

  // Mock database for Trips
  let trips = [
    {
      id: "1",
      title: 'رحلة إلى مدينة الأقصر وأسوان',
      date: 'إجازة منتصف العام',
      duration: '5 أيام / 4 ليالي',
      price: '1500 ج.م',
      status: 'متاح التسجيل',
      image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&q=80&w=800',
      rating: 0,
      reviewsCount: 0
    },
    {
      id: "2",
      title: 'معسكر شرم الشيخ الترفيهي',
      date: 'نهاية الفصل الدراسي',
      duration: '4 أيام / 3 ليالي',
      price: '1200 ج.م',
      status: 'اكتمل العدد',
      image: 'https://images.unsplash.com/photo-1551882808-111db09d2e1c?auto=format&fit=crop&q=80&w=800',
      rating: 0,
      reviewsCount: 0
    },
    {
      id: "3",
      title: 'رحلة إلى محمية وادي الريان',
      date: '١٠ أكتوبر ٢٠٢٣',
      duration: 'يوم واحد',
      price: '٣٠٠ ج.م',
      status: 'منتهية',
      image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      reviewsCount: 85
    }
  ];

  app.get("/api/trips", (req, res) => {
    res.json(trips);
  });

  app.post("/api/trips", (req, res) => {
    const newTrip = {
      id: Date.now().toString(),
      title: req.body.title,
      date: req.body.date,
      duration: req.body.duration,
      price: req.body.price,
      status: req.body.status || 'متاح التسجيل',
      image: req.body.image || 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&q=80&w=800',
      rating: 0,
      reviewsCount: 0
    };
    trips.unshift(newTrip);
    res.status(201).json({ success: true, trip: newTrip });
  });

  app.put("/api/trips/:id", (req, res) => {
    const { id } = req.params;
    const tripIndex = trips.findIndex(t => t.id === id);
    if (tripIndex > -1) {
      trips[tripIndex] = {
        ...trips[tripIndex],
        title: req.body.title,
        date: req.body.date,
        duration: req.body.duration,
        price: req.body.price,
        status: req.body.status,
        image: req.body.image
      };
      res.json({ success: true, trip: trips[tripIndex] });
    } else {
      res.status(404).json({ error: "Trip not found" });
    }
  });

  app.delete("/api/trips/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = trips.length;
    trips = trips.filter(t => t.id !== id);
    if (trips.length < initialLength) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Trip not found" });
    }
  });

  app.post("/api/trips/:id/rate", (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const tripIndex = trips.findIndex(t => t.id === id);
    if (tripIndex > -1 && rating >= 1 && rating <= 5) {
      const trip = trips[tripIndex];
      const newReviewsCount = trip.reviewsCount + 1;
      const newRating = ((trip.rating * trip.reviewsCount) + rating) / newReviewsCount;
      trips[tripIndex].rating = newRating;
      trips[tripIndex].reviewsCount = newReviewsCount;
      res.json({ success: true, trip: trips[tripIndex] });
    } else {
      res.status(404).json({ error: "Trip not found or invalid rating" });
    }
  });

  // Mock database for Elections
  let elections = [
    {
      id: "1",
      title: 'فتح باب الترشح',
      date: '١٠ نوفمبر',
      icon: 'FileText',
      status: 'completed',
    },
    {
      id: "2",
      title: 'الدعاية الانتخابية',
      date: '١٥ نوفمبر',
      icon: 'Megaphone',
      status: 'active',
    },
    {
      id: "3",
      title: 'التصويت الإلكتروني',
      date: '٢٠ نوفمبر',
      icon: 'Vote',
      status: 'upcoming',
    },
    {
      id: "4",
      title: 'إعلان النتائج',
      date: '٢٢ نوفمبر',
      icon: 'Trophy',
      status: 'upcoming',
    }
  ];

  app.get("/api/elections", (req, res) => {
    res.json(elections);
  });

  app.post("/api/elections", (req, res) => {
    const newElection = {
      id: Date.now().toString(),
      title: req.body.title,
      date: req.body.date,
      icon: req.body.icon || 'FileText',
      status: req.body.status || 'upcoming',
    };
    elections.push(newElection);
    res.status(201).json({ success: true, election: newElection });
  });

  app.put("/api/elections/:id", (req, res) => {
    const { id } = req.params;
    const electionIndex = elections.findIndex(e => e.id === id);
    if (electionIndex > -1) {
      elections[electionIndex] = {
        ...elections[electionIndex],
        title: req.body.title,
        date: req.body.date,
        icon: req.body.icon,
        status: req.body.status
      };
      res.json({ success: true, election: elections[electionIndex] });
    } else {
      res.status(404).json({ error: "Election step not found" });
    }
  });

  app.delete("/api/elections/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = elections.length;
    elections = elections.filter(e => e.id !== id);
    if (elections.length < initialLength) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Election step not found" });
    }
  });

  // Mock database for Social Solidarity requests
  let solidarityRequests = [
    {
      id: "1",
      name: "أحمد محمود سالم",
      studentId: "20210543",
      assistanceType: "tuition",
      details: "ظروف عائلية تمنع من سداد المصروفات بالكامل",
      status: "pending",
      submittedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "مريم حسن السيد",
      studentId: "20220198",
      assistanceType: "books",
      details: "",
      status: "approved",
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  
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

  // 3. التكافل الاجتماعي (Social Solidarity API)
  

  app.post("/api/register-activity", (req, res) => {
    const { activityName, committee, studentId } = req.body;
    
    // Add to notifications
    notifications.push({
      id: Date.now(),
      title: 'تأكيد التسجيل في النشاط',
      content: `تم تسجيلك بنجاح في ${activityName} التابع لـ ${committee}. سيتم التواصل معك قريباً بالتفاصيل.`,
      type: 'success',
      date: new Date().toISOString(),
      read: false
    });

    res.json({ success: true, message: "تم التسجيل بنجاح وتم إرسال إشعار" });
  });

  // Get all requests

  app.get("/api/solidarity-requests", (req, res) => {
    res.json(solidarityRequests);
  });

  // Create a new request
  app.post("/api/solidarity-requests", (req, res) => {
    const newReq = {
      id: Date.now().toString(),
      name: req.body.name,
      studentId: req.body.studentId,
      assistanceType: req.body.assistanceType,
      details: req.body.details || '',
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    solidarityRequests.push(newReq);
    
    res.status(201).json({ 
      success: true,
      message: "تم تسجيل الطلب بنجاح، حالة الطلب: قيد المراجعة",
      request: newReq
    });
  });

  // Update request status
  app.patch("/api/solidarity-requests/:id/status", (req, res) => {
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
          contentMsg += '\nملاحظة الإدارة: ' + note;
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
  });

  // Assistant Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        // Fallback mock response if AI is not configured
        return res.json({ 
          reply: "مرحباً بك! هذه إجابة تجريبية حيث لم يتم تهيئة المساعد الذكي بعد. يرجى إعداد مفتاح GEMINI_API_KEY." 
        });
      }

      const systemInstruction = `أنت مساعد افتراضي ذكي مخصص للإجابة على استفسارات طلاب كلية التربية النوعية.
      مهمتك الأساسية هي إرشاد الطلاب حول:
      1. الأنشطة الجامعية والفعاليات (الرياضية، الثقافية، الفنية، الجوالة).
      2. إجراءات وشروط التكافل الاجتماعي وكيفية التقديم.
      3. الرحلات والمعسكرات الطلابية.
      4. انتخابات اتحاد الطلاب.
      أجب باللغة العربية، بأسلوب مهذب ومباشر وداعم للطلاب.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "حدث خطأ أثناء معالجة طلبك." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
