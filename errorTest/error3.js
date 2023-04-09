const fs = require('fs').promises;

setInterval(() => {
    fs.unlink('./abcd.js');
}, 1000);

