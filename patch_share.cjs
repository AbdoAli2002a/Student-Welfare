const fs = require('fs');
let code = fs.readFileSync('src/components/ActivitiesList.tsx', 'utf8');

const importOld = "import { Calendar as CalendarIcon, MapPin, ArrowRight, QrCode, MessageSquare } from 'lucide-react';";
const importNew = "import { Calendar as CalendarIcon, MapPin, ArrowRight, QrCode, MessageSquare, Share2 } from 'lucide-react';\nimport { useToast } from '../contexts/ToastContext';";

if (code.includes(importOld)) {
    code = code.replace(importOld, importNew);
}

const functionStartOld = "  const [userInterests, setUserInterests] = useState<string[]>([]);";
const functionStartNew = `  const [userInterests, setUserInterests] = useState<string[]>([]);
  const { addToast } = useToast();

  const handleShare = async (activity: Activity) => {
    const activityDate = new Date(activity.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const shareText = \`انضم إلينا في "\${activity.title}"!\\nالموعد: \${activityDate}\\nالمكان: \${activity.location}\\n\\nللتفاصيل والتسجيل، قم بزيارة منصة رعاية الشباب.\`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText + '\\n' + window.location.href);
      addToast('success', 'تم نسخ تفاصيل النشاط للحافظة بنجاح');
    }
  };`;

if (code.includes(functionStartOld)) {
    code = code.replace(functionStartOld, functionStartNew);
}

const cardStartOld = `<div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {getStatusBadge(activity.status)}
                      {userInterests.includes(activity.committee) && activeTab === 'current' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                          🌟 مقترح لك
                        </span>
                      )}
                    </div>
                  </div>`;
const cardStartNew = `<div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {getStatusBadge(activity.status)}
                      {userInterests.includes(activity.committee) && activeTab === 'current' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                          🌟 مقترح لك
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleShare(activity)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                      title="مشاركة النشاط"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>`;

if (code.includes(cardStartOld)) {
    code = code.replace(cardStartOld, cardStartNew);
} else {
    console.error("cardStartOld not found");
}

fs.writeFileSync('src/components/ActivitiesList.tsx', code);
