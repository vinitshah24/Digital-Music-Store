// Import path package from npm
const path = require('path');

// Locate path from app.js -> main file
module.exports = path.dirname(process.mainModule.filename);