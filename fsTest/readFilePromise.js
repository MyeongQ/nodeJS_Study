const fs = require('fs').promises; // then 사용 가능!

fs.readFile('./Readme.txt')
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        console.error(err);
    });