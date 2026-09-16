import React, { useState } from "react";
import { MessageSquare, X, Send, CheckCircle } from "lucide-react";

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messageType, setMessageType] = useState<'suggestion' | 'issue'>('suggestion');
  const [category, setCategory] = useState<'academic' | 'recreational' | 'social'>('academic');

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 no-print"
        title="تقديم مقترح أو شكوى"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal */}
      <div
        className="fixed bottom-6 right-6 sm:bottom-auto sm:right-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-[calc(100%-3rem)] sm:w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            المقترحات والشكاوى
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                تم الإرسال بنجاح!
              </h4>
              <p className="text-slate-500 mb-6">
                شكراً لتواصلك معنا. سيتم مراجعة رسالتك في أقرب وقت.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setIsOpen(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                إغلاق
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  نوع الرسالة
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="suggestion"
                      checked={messageType === 'suggestion'}
                      onChange={(e) => setMessageType(e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">مقترح</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="issue"
                      checked={messageType === 'issue'}
                      onChange={(e) => setMessageType(e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">شكوى / مشكلة</span>
                  </label>
                </div>
              </div>

              {messageType === 'suggestion' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    تصنيف المقترح
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="academic">أكاديمي</option>
                    <option value="recreational">ترفيهي</option>
                    <option value="social">اجتماعي</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  الموضوع
                </label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="عنوان الرسالة"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  التفاصيل
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="اكتب تفاصيل رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                إرسال
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
