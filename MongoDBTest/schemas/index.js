const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true); // 콘솔에서 쿼리 확인 가능
    }
    mongoose.connect('mongodb://root:1234@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true, // 몽구스 6부터 자동 지원
        //useCreateIndex: true,
    }, (error) => {
        if (error) {
            console.log('몽고DB 연결 에러', error);
        } else {
            console.log('몽고DB 연결 성공');
        }
    });
};
// 에러 처리 이벤트 리스너 추가
mongoose.connection.on('error', (error) => { 
    console.error('몽고DB 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고DB 연결 끊어짐. 연결 재시도');
});

module.exports = connect;