const fs = require('fs');
let code = fs.readFileSync('src/components/NotificationCenter.tsx', 'utf8');

code = code.replace(
  "import { Bell, CheckCircle, Info, AlertTriangle, Trash2, Check, ArrowLeft } from 'lucide-react';",
  "import { Bell, CheckCircle, Info, AlertTriangle, Trash2, Check, ArrowLeft, Clock } from 'lucide-react';\nimport { useToast } from '../contexts/ToastContext';"
);

code = code.replace(
  "export default function NotificationCenter({ onBack }: { onBack: () => void }) {",
  "export default function NotificationCenter({ onBack }: { onBack: () => void }) {\n  const { addToast } = useToast();"
);

code = code.replace(
  "const markAllAsRead = () => {",
  `  const simulateReminders = () => {
    const reminder = {
      id: Date.now(),
      title: 'تذكير: رحلة الأقصر غداً',
      content: 'تبدأ رحلة الأقصر وأسوان غداً في تمام الساعة ٧ صباحاً. لا تنسَ إحضار التذكرة والبطاقة الجامعية.',
      type: 'warning',
      date: 'الآن',
      read: false
    };
    setNotifications(prev => [reminder, ...prev]);
    addToast('تم تفعيل التذكيرات التلقائية (محاكاة قبل ٢٤ ساعة)', 'success');
  };

  const markAllAsRead = () => {`
);

code = code.replace(
  `            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
              >
                <Check className="w-4 h-4" />
                تحديد الكل كمقروء
              </button>
            )}`,
  `            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={simulateReminders}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg"
              >
                <Clock className="w-4 h-4" />
                تفعيل تذكيرات 24 ساعة (محاكاة)
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>`
);

fs.writeFileSync('src/components/NotificationCenter.tsx', code);
