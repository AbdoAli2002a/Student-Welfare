const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importOld = "import SosButton from './components/SosButton';";
const importNew = "import SosButton from './components/SosButton';\nimport ContactUsButton from './components/ContactUsButton';";
code = code.replace(importOld, importNew);

const renderOld = `      <VirtualAssistant />
      <SosButton />`;
const renderNew = `      <VirtualAssistant />
      <ContactUsButton />
      <SosButton />`;
code = code.replace(renderOld, renderNew);

fs.writeFileSync('src/App.tsx', code);
