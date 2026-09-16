const fs = require('fs');
let code = fs.readFileSync('src/components/StudentProfile.tsx', 'utf8');

// 1. Add Import
if (!code.includes('import DigitalIdCardModal')) {
    code = code.replace(
        "import CertificateModal from './CertificateModal';",
        "import CertificateModal from './CertificateModal';\nimport DigitalIdCardModal from './DigitalIdCardModal';"
    );
}

// 2. Add State
if (!code.includes('const [idCardModalOpen, setIdCardModalOpen] = useState(false);')) {
    code = code.replace(
        "const [certificateModalOpen, setCertificateModalOpen] = useState(false);",
        "const [certificateModalOpen, setCertificateModalOpen] = useState(false);\n  const [idCardModalOpen, setIdCardModalOpen] = useState(false);"
    );
}

// 3. Update UI to add button to open modal
const oldUI = `            {/* Digital ID Card visualization */}
            <div className="px-6 pb-6 pt-2">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                <h3 className="text-xs font-semibold text-blue-200 mb-4">بطاقة الطالب الرقمية</h3>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="font-bold text-lg leading-tight">{studentInfo.name}</p>
                    <p className="text-xs text-blue-200 mt-1">{studentInfo.major}</p>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=2021045678" alt="QR Code" className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>`;

const newUI = `            {/* Digital ID Card visualization */}
            <div className="px-6 pb-6 pt-2">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIdCardModalOpen(true)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-xs font-semibold text-blue-200">بطاقة الطالب الرقمية</h3>
                  <span className="text-[10px] bg-blue-700/50 px-2 py-1 rounded text-blue-100 flex items-center gap-1">عرض الكارنيه</span>
                </div>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <p className="font-bold text-lg leading-tight">{studentInfo.name}</p>
                    <p className="text-xs text-blue-200 mt-1">{studentInfo.major}</p>
                  </div>
                  <div className="bg-white p-1 rounded">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=2021045678" alt="QR Code" className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>`;

if(code.includes(oldUI)) {
    code = code.replace(oldUI, newUI);
} else {
    console.error("Could not find old UI block");
}

// 4. Add DigitalIdCardModal to JSX (at the bottom before last </div>)
const oldClosing = `    </div>
  );
}`;

const newClosing = `      <DigitalIdCardModal
        isOpen={idCardModalOpen}
        onClose={() => setIdCardModalOpen(false)}
        studentInfo={studentInfo}
      />
    </div>
  );
}`;

if(code.includes(oldClosing)) {
    code = code.replace(oldClosing, newClosing);
}

fs.writeFileSync('src/components/StudentProfile.tsx', code);
