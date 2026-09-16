const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  "allow create: if isSignedIn() && request.auth.uid == userId",
  "allow create: if (isSignedIn() && request.auth.uid == userId || isAdmin())"
);

fs.writeFileSync('firestore.rules', code);
