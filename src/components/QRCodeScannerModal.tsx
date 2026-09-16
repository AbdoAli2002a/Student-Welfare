import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  onSuccess: () => void;
}

export default function QRCodeScannerModal({ isOpen, onClose, activityName, onSuccess }: QRCodeScannerModalProps) {
  const [status, setStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      setScannerActive(true);
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setScannerActive(false);
    }
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (scannerActive && status === 'scanning') {
      const startScanner = () => {
        try {
          if (!document.getElementById('qr-reader')) return;
          
          if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
              "qr-reader",
              { fps: 10, qrbox: { width: 250, height: 250 } },
              /* verbose= */ false
            );
            
            scannerRef.current.render((decodedText) => {
              // On success
              if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
              }
              setScannerActive(false);
              setStatus('success');
              
              setTimeout(() => {
                onSuccess();
              }, 1500);
            }, (error) => {
              // On error - ignore to keep scanning
            });
          }
        } catch (e) {
          console.error(e);
        }
      };

      // Slight delay to ensure DOM element is ready
      const timeout = setTimeout(startScanner, 100);
      return () => clearTimeout(timeout);
    }
  }, [scannerActive, status, onSuccess]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setScannerActive(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity" onClick={handleClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-50" dir="rtl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            تسجيل الحضور
          </h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 text-center">
          <h4 className="font-bold text-slate-900 mb-6">{activityName}</h4>
          
          {status === 'scanning' && (
            <div className="flex flex-col items-center">
              <div className="w-full mb-6 relative overflow-hidden rounded-xl border border-slate-200">
                <div id="qr-reader" className="w-full"></div>
                {!scannerActive && (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-slate-300 animate-pulse" />
                  </div>
                )}
              </div>
              <p className="text-slate-600 font-medium">يرجى توجيه الكاميرا نحو رمز QR</p>
              <p className="text-xs text-slate-400 mt-2">قم بمسح الرمز الذي يوفره مشرف النشاط</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center py-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">تم تسجيل الحضور!</h4>
              <p className="text-slate-500 text-sm">تم مزامنة حضورك في هذا النشاط بنجاح.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center py-6">
              <AlertCircle className="w-20 h-20 text-red-500 mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">فشل التسجيل</h4>
              <p className="text-slate-500 text-sm">الرمز غير صالح أو تم تسجيل حضورك مسبقاً.</p>
              <button 
                onClick={() => {
                  setStatus('scanning');
                  setScannerActive(true);
                }}
                className="mt-6 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                المحاولة مرة أخرى
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
