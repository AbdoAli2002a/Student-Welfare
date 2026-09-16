import React, { useState, useEffect } from 'react';
import { Settings, Eye, Type, ZoomIn, ZoomOut, Moon, Sun } from 'lucide-react';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-large', 'text-xlarge', 'high-contrast');
    
    if (fontSize === 'large') {
      html.classList.add('text-large');
    } else if (fontSize === 'xlarge') {
      html.classList.add('text-xlarge');
    }

    if (highContrast) {
      html.classList.add('high-contrast');
    }
  }, [fontSize, highContrast]);

  const handleZoomIn = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
  };

  const handleZoomOut = () => {
    if (fontSize === 'xlarge') setFontSize('large');
    else if (fontSize === 'large') setFontSize('normal');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="إمكانية الوصول"
        aria-label="خيارات إمكانية الوصول"
      >
        <Eye className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50">
          <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">إمكانية الوصول</h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
                <Type className="w-4 h-4" />
                حجم الخط
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={fontSize === 'normal'}
                  className="flex-1 flex justify-center items-center py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="تصغير الخط"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 flex justify-center items-center py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md">
                  {fontSize === 'normal' ? 'عادي' : fontSize === 'large' ? 'كبير' : 'كبير جداً'}
                </div>
                <button
                  onClick={handleZoomIn}
                  disabled={fontSize === 'xlarge'}
                  className="flex-1 flex justify-center items-center py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="تكبير الخط"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-1">
                <Sun className="w-4 h-4" />
                التباين البصري
              </p>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full py-2 rounded-md font-bold transition-colors flex items-center justify-center gap-2 ${
                  highContrast 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {highContrast ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {highContrast ? 'إلغاء التباين العالي' : 'تفعيل التباين العالي'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
