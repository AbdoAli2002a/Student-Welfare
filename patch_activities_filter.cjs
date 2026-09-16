const fs = require('fs');
let code = fs.readFileSync('src/components/ActivitiesList.tsx', 'utf8');

// 1. Add imports
const importsOld = "import { Calendar as CalendarIcon, MapPin, ArrowRight, QrCode, MessageSquare, Share2 } from 'lucide-react';";
const importsNew = "import { Calendar as CalendarIcon, MapPin, ArrowRight, QrCode, MessageSquare, Share2, Filter, ArrowDownUp } from 'lucide-react';";
if (code.includes(importsOld)) {
    code = code.replace(importsOld, importsNew);
} else {
    console.error("importsOld not found");
}

// 2. Add states
const statesOld = "  const [userInterests, setUserInterests] = useState<string[]>([]);";
const statesNew = `  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortDate, setSortDate] = useState<'default' | 'asc' | 'desc'>('default');`;
if (code.includes(statesOld)) {
    code = code.replace(statesOld, statesNew);
} else {
    console.error("statesOld not found");
}

// 3. Update filter logic
const filterOld = `  const filteredActivities = activities.filter((activity) => 
    activeTab === 'current' ? activity.status !== 'completed' : activity.status === 'completed'
  ).sort((a, b) => {
    const aMatch = userInterests.includes(a.committee) ? 1 : 0;
    const bMatch = userInterests.includes(b.committee) ? 1 : 0;
    return bMatch - aMatch;
  });`;

const filterNew = `  const filteredActivities = activities.filter((activity) => {
      // Tab filter
      if (activeTab === 'current' && activity.status === 'completed') return false;
      if (activeTab === 'archive' && activity.status !== 'completed') return false;
      
      // Type filter
      if (filterType !== 'all' && activity.committee !== filterType) return false;
      
      return true;
  }).sort((a, b) => {
      // Date Sort
      if (sortDate === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortDate === 'desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      // Default Sort (Interests first)
      const aMatch = userInterests.includes(a.committee) ? 1 : 0;
      const bMatch = userInterests.includes(b.committee) ? 1 : 0;
      return bMatch - aMatch;
  });`;

if (code.includes(filterOld)) {
    code = code.replace(filterOld, filterNew);
} else {
    console.error("filterOld not found, attempting loose match");
    // Sometimes newlines are different
    const looserFilter = code.replace(
      /const filteredActivities = activities\.filter[\s\S]*?return bMatch - aMatch;\s*\}\);/,
      filterNew
    );
    if(looserFilter !== code) {
      code = looserFilter;
    } else {
      console.error("loose match also failed");
    }
}

// 4. Add filter bar JSX
const tabEndOld = `            </button>
          </div>
        </div>

        {loading ? (`;
        
const tabEndNew = `            </button>
          </div>
        </div>

        {activeTab !== 'calendar' && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-bold shrink-0">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>تصفية الأنشطة:</span>
            </div>
            
            <div className="flex-grow w-full flex flex-col sm:flex-row gap-4 items-center">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="all">كل الأنواع</option>
                <option value="sports">نشاط رياضي</option>
                <option value="cultural">نشاط ثقافي</option>
                <option value="artistic">نشاط فني</option>
                <option value="scouting">نشاط جوالة</option>
                <option value="scientific">نشاط علمي</option>
                <option value="social">نشاط اجتماعي</option>
              </select>

              <div className="w-full sm:w-auto flex items-center gap-2 sm:border-r sm:border-slate-200 sm:pr-4">
                <ArrowDownUp className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select 
                  value={sortDate}
                  onChange={(e) => setSortDate(e.target.value as any)}
                  className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="default">الترتيب الافتراضي (المقترحات أولاً)</option>
                  <option value="asc">تاريخ البدء (الأقدم أولاً)</option>
                  <option value="desc">تاريخ البدء (الأحدث أولاً)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (`;

if (code.includes(tabEndOld)) {
    code = code.replace(tabEndOld, tabEndNew);
} else {
    console.error("tabEndOld not found");
}

fs.writeFileSync('src/components/ActivitiesList.tsx', code);
