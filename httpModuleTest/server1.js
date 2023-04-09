const http = require('http');

const server = http.createServer((req, res) => {
    // 브라우저에 문자열이 html임을 알림 + 한국어 지원
    res.writeHead(200, { 'Content-Type' : 'text/html; charset-utf8'})
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello Server</p>');
    res.end('<p>Hello Mike</p>');
})
    .listen(8080);
server.on('listening', () => {
    console.log('Server Listening on Port 8080!');
});
server.on('error', (error) => {
    console.error(error);
})