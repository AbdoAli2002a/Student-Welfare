const { createStudentAccount } = require('./dist/server.cjs'); // wait, auth-helpers is client side

// Let's write a small node script, but we don't have secondaryAuth working in node easily without polyfills.
