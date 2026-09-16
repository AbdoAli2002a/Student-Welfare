const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navOld = `<Navbar setCurrentView={setCurrentView} currentView={currentView} />`;
const navNew = `<div className="no-print"><Navbar setCurrentView={setCurrentView} currentView={currentView} /></div>`;
if (code.includes(navOld) && !code.includes('no-print"><Navbar')) {
    code = code.replace(navOld, navNew);
}

const footOld = `<Footer />`;
const footNew = `<div className="no-print"><Footer /></div>`;
if (code.includes(footOld) && !code.includes('no-print"><Footer')) {
    code = code.replace(footOld, footNew);
}

fs.writeFileSync('src/App.tsx', code);
