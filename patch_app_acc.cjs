const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importOld = "import ContactUsButton from './components/ContactUsButton';";
const importNew = "import ContactUsButton from './components/ContactUsButton';\nimport AccessibilityToolbar from './components/AccessibilityToolbar';";
code = code.replace(importOld, importNew);

const renderOld = `      <VirtualAssistant />`;
const renderNew = `      <AccessibilityToolbar />\n      <VirtualAssistant />`;
code = code.replace(renderOld, renderNew);

fs.writeFileSync('src/App.tsx', code);
