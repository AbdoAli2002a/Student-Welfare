import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 p-8 flex-shrink-0 print:hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        تذييل الصفحة
      </h2>
      <div className="mx-auto max-w-7xl">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-slate-700 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                 ن
               </div>
               <span className="text-white font-bold text-sm">رعاية الطلاب</span>
            </div>
            <p className="text-xs leading-5 text-slate-400 max-w-xs">
              بوابة متكاملة لتقديم الخدمات الطلابية ودعم الأنشطة والمبادرات داخل كلية التربية النوعية.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold leading-6 text-white">روابط سريعة</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-xs leading-6 text-slate-400 hover:text-white transition-colors">الرئيسية</a>
                  </li>
                  <li>
                    <a href="#activities" className="text-xs leading-6 text-slate-400 hover:text-white transition-colors">الأنشطة المتاحة</a>
                  </li>
                  <li>
                    <a href="#solidarity" className="text-xs leading-6 text-slate-400 hover:text-white transition-colors">نموذج التكافل الاجتماعي</a>
                  </li>
                  <li>
                    <a href="#elections" className="text-xs leading-6 text-slate-400 hover:text-white transition-colors">اتحاد الطلاب</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-xs font-bold leading-6 text-white">تواصل معنا</h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-xs leading-6 text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    مبنى الأنشطة، الدور الأرضي
                  </li>
                  <li className="flex items-center gap-2 text-xs leading-6 text-slate-400">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span>02-12345678</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs leading-6 text-slate-400">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <a href="mailto:care@edu.eg" className="hover:text-white transition-colors">care@edu.eg</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="text-xs leading-5 text-slate-500 text-center">
            &copy; {new Date().getFullYear()} مكتب رعاية الطلاب بكلية التربية النوعية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
