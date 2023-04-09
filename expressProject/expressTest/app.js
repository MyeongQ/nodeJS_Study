const express = require('express');
const path = require('path');

const app = express();
// 전역으로 변수 설정
app.set('port', process.env.PORT || 3000);
app.use((req, res, next) => {
    console.log('모든 요청에 대해 실행');
    next();  // 다음 라우터로 넘어가기 위함
}, (req, res, next) => {
    console.log('모든 요청에 대해 실행');
    next();
}, (req, res, next) => {
    //throw new Error('에러 발생');
    next();
})

app.get('/', (req, res, next) => {
    // res.send('hello express');
    res.sendFile(path.join(__dirname, 'index.html'));
    next('route');
}, (req, res) => {
    console.log('실행되나요?');
});
app.get('/', (req, res) => {
    res.json({"hello" : "world"});
});

app.get('/category/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
})
// app.get('*', (req, res) => {
//     res.send('hello everybody');
// })

app.use((req, res, next) => {
    res.send('페이지를 찾을 수 없습니다 : 404');
})
app.use((err, req, res, next) => {
    console.error(err);
    next();
})

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행 : 포트 ', app.get('port'));
});

