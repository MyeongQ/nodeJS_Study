const fs = require('fs');

fs.readFile('./Readme.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data); // 버퍼 형식(16진수)으로 반환
    console.log(data.toString()); // 문자열로 변환
})