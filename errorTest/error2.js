const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcd.js', (err) => {
        if (err) {
            console.error(err);
        }
    });
}, 1000);

