const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importOld = "import { ToastProvider } from './contexts/ToastContext';";
const importNew = "import { ToastProvider } from './contexts/ToastContext';\nimport PushNotificationManager from './components/PushNotificationManager';";

if (code.includes(importOld)) {
    code = code.replace(importOld, importNew);
}

const tagOld = "<ToastProvider>";
const tagNew = "<ToastProvider>\n      <PushNotificationManager />";

if (code.includes(tagOld)) {
    code = code.replace(tagOld, tagNew);
}

fs.writeFileSync('src/App.tsx', code);
