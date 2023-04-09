const fs = require('fs').promises;

fs.writeFile('./Writeme.txt', '테스트 작성')
    .then(() => {
        return fs.readFile('./Writeme.txt');
    })
    .then((data) => {
        console.log(data.toString());
    })
    .catch((err) => {
        console.error(err);
    })

    