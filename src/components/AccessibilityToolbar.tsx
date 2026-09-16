import React, { useState, useEffect } from 'react';
import { Accessibility, ZoomIn, ZoomOut, Eye, RefreshCw, X, Monitor } from 'lucide-react';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  useEffect(() => {
    // Apply Font Size scaling to the root HTML element
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Apply High Contrast and Grayscale filters
    let filter = '';
    if (highContrast) filter += 'contrast(150%) saturate(150%) ';
    if (grayscale) filter += 'grayscale(100%) ';
    
    document.documentElement.style.filter = filter.trim() || 'none';
    
    // Make text slightly bolder in high contrast mode to improve readability
    if (highContrast) {
       document.documentElement.style.textShadow = '0 0 1px currentColor';
    } else {
       document.documentElement.style.textShadow = 'none';
    }
  }, [fontSize, highContrast, grayscale]);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 10, 150));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 10, 80));
  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    setGrayscale(false);
  };

  return (
    <div className="fixed top-1/3 right-0 z-50 flex items-start" dir="rtl">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-800 text-white p-3.5 rounded-l-xl shadow-lg hover:bg-slate-700 transition-colors border-y border-l border-slate-600"
          title="أدوات سهولة الوصول"
          aria-label="أدوات سهولة الوصول"
        >
          <Accessibility className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-l-2xl w-80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              <h3 className="font-bold text-lg">أدوات سهولة الوصول</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-6">
            {/* Font Size Settings */}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">حجم النص المستهدف</p>
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={increaseFont}
                  disabled={fontSize >= 150}
                  className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  <ZoomIn className="w-5 h-5" />
                  <span className="text-xs font-bold">تكبير</span>
                </button>
                <div className="font-bold text-blue-600 w-16 text-center text-lg bg-blue-50 py-2 rounded-lg">
                  {fontSize}%
                </div>
                <button 
                  onClick={decreaseFont}
                  disabled={fontSize <= 80}
                  className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  <ZoomOut className="w-5 h-5" />
                  <span className="text-xs font-bold">تصغير</span>
                </button>
              </div>
            </div>

            {/* Contrast Settings */}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-3">التباين والألوان</p>
              <div className="space-y-3">
                <button 
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${highContrast ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span className="font-bold text-sm">تباين عالي (High Contrast)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${highContrast ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {highContrast && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>

                <button 
                  onClick={() => setGrayscale(!grayscale)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${grayscale ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5" />
                    <span className="font-bold text-sm">تدرج رمادي (Grayscale)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${grayscale ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {grayscale && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة ضبط الإعدادات الافتراضية
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
