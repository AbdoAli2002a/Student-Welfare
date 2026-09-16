import React, { useState } from "react";
import { MessageSquare, CheckCircle, Search, Eye, Filter } from "lucide-react";

export default function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      type: "suggestion",
      category: "academic",
      title: "إضافة أنشطة برمجة للجنة العلمية",
      details:
        "أقترح إضافة مسابقات برمجية وأنشطة تخص الذكاء الاصطناعي للجنة العلمية لتنمية مهارات الطلاب.",
      date: "2026-07-20",
      status: "new",
      sender: "أحمد محمود",
      studentId: "20230001",
    },
    {
      id: 2,
      type: "issue",
      category: undefined,
      title: "تأخر في الرد على طلب التكافل",
      details:
        "قدمت طلب تكافل منذ أسبوعين ولم يتم الرد أو تغيير حالة الطلب حتى الآن.",
      date: "2026-07-18",
      status: "read",
      sender: "فاطمة علي",
      studentId: "20230045",
    },
    {
      id: 3,
      type: "suggestion",
      category: "social",
      title: "تنظيم رحلة لمعرض الكتاب",
      details:
        "نرجو تنظيم رحلة مخفضة لزيارة معرض القاهرة الدولي للكتاب في دورته القادمة.",
      date: "2026-07-15",
      status: "resolved",
      sender: "محمود سيد",
      studentId: "20220120",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const filteredFeedback = feedbackList.filter((f) => {
    const matchesSearch =
      f.title.includes(searchTerm) || f.sender.includes(searchTerm);
    const matchesType = filterType === "all" || f.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setFeedbackList(
      feedbackList.map((f) => (f.id === id ? { ...f, status: newStatus } : f)),
    );
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status: newStatus });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-bold">
            جديد
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-bold">
            تمت القراءة
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-bold">
            تم الحل
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "suggestion" ? (
      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-bold">
        مقترح
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-bold">
        شكوى
      </span>
    );
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case "academic":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-bold mr-1">
            أكاديمي
          </span>
        );
      case "recreational":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-bold mr-1">
            ترفيهي
          </span>
        );
      case "social":
        return (
          <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-md font-bold mr-1">
            اجتماعي
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            المقترحات والشكاوى
          </h3>
          <p className="text-sm text-slate-500">
            إدارة آراء ومقترحات وشكاوى الطلاب.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="البحث بالعنوان أو اسم الطالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
            >
              <option value="all">الكل (مقترحات وشكاوى)</option>
              <option value="suggestion">المقترحات فقط</option>
              <option value="issue">الشكاوى فقط</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          {filteredFeedback.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>لا توجد رسائل مطابقة لبحثك.</p>
            </div>
          ) : (
            <table className="w-full text-right text-sm text-slate-600 whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">
                    النوع
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold">
                    عنوان الرسالة
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold">
                    المرسل
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold">
                    التاريخ
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold">
                    الحالة
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFeedback.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center">
                      {getTypeBadge(item.type)}
                      {getCategoryBadge(item.category)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.sender}</td>
                    <td className="px-6 py-4 text-slate-500">{item.date}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-1 font-bold text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                تفاصيل الرسالة
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-lg p-1 transition-colors border border-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    {getTypeBadge(selectedFeedback.type)}
                    {getCategoryBadge(selectedFeedback.category)}
                  </div>
                  <h4 className="font-extrabold text-xl text-slate-900 mt-2">
                    {selectedFeedback.title}
                  </h4>
                </div>
                {getStatusBadge(selectedFeedback.status)}
              </div>

              <div className="flex gap-6 py-3 border-y border-slate-100 text-sm text-slate-600 bg-slate-50 px-4 rounded-lg">
                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    المرسل
                  </span>
                  {selectedFeedback.sender}
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    الرقم الجامعي
                  </span>
                  {selectedFeedback.studentId}
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1">
                    تاريخ الإرسال
                  </span>
                  {selectedFeedback.date}
                </div>
              </div>

              <div>
                <span className="block text-sm font-bold text-slate-700 mb-2">
                  التفاصيل:
                </span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px]">
                  {selectedFeedback.details}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-sm font-bold text-slate-700">
                  تحديث الحالة:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedFeedback.id, "read")
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${selectedFeedback.status === "read" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    تمت القراءة
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedFeedback.id, "resolved")
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${selectedFeedback.status === "resolved" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    تم الحل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
