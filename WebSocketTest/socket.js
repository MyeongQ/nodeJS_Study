const { Server } = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
    const io = new Server (server, { path: '/socket.io'});
    // 두 번째 인수 = 서버 설정 (ex. path)
    app.set('io', io); // 라우터에서 req.app.get('io')로 접근 가능
    const room = io.of('/room'); // socket.IO에 namespace 부여
    const chat = io.of('/chat'); // 기본적으로 같은 namespace끼리 데이터 공유

    // 모든 웹 소켓 연결마다 실행
    /** socket.io 2버전
     * io.use(() => {
        // socket.request에 session, cookie를 제공
        // cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next)
        // sessionMiddleware(socket.request, socket.request.res, next);  
    })
     * 
     */
    
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
    chat.use(wrap(sessionMiddleware));
 
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스에 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        const req = socket.request; // socket.request.session.color가 아직 존재하지 않음
        const { headers: { referer } } = req;
        console.log('referer: ', referer)
        console.log(req.session.color);
        
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/\?.+/, '');
        socket.join(roomId); //같은 roomId 내 사람들끼리 데이터 주고받을 수 있음
        // join : 입장에 대한 데이터 전송시 호출
        // socket.to(roomId) : 특정 아이디로 메서드 호출 및 데이터 전송 가능
        let currentRoom = socket.adapter.rooms.get(roomId);
        let userList = Array.from(currentRoom);
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`,
            list: userList,
        });
        //socket.to()
        console.log('유저 리스트', userList);
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            console.log(socket.adapter.rooms);
            socket.leave(roomId); //
            currentRoom = socket.adapter.rooms.get(roomId);
            console.log(currentRoom);
            if(currentRoom) {
                userList = Array.from(currentRoom);
            }
            const userCount = currentRoom ? currentRoom.length : 0;

            if (userCount === 0) { // 접속자가 0명이면 방을 삭제
                const signedCookie = req.signedCookies['connect.sid']
                const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);
                axios.delete(`http://localhost:8005/room/${roomId}`, {
                    headers: {
                        Cookie: `connect.sid=s%3A${connectSID}`,
                    }
                })
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`,
                    list: userList,
                })
            }
        });
    });
    /*
    io.on('connection', (socket) => { // 웹소켓 연결 시
        const req = socket.request; // request는 socket 안에 내장
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        // socket id를 통해 특정 클라리언트에 대한 작업 처리 가능 
        socket.on('disconnect', () => { // 연결 종료 시
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => { // 에러 시
            console.error(error);
        });
        socket.on('reply', (data) => { // 클라리언트로부터 메세지 수신 시
            console.log(data);
        });

        socket.interval = setInterval(() => { //3초마다 클라이언트로 메세지 전송
            socket.emit('news', 'Hello Socket.IO');
            // news라는 이름의 이벤트로 Hello Socket.IO 데이터를 클라이언트에 전달
        }, 3000);
    });
    */
};

