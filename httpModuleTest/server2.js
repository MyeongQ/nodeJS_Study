const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
    try{
        // 브라우저에 문자열이 html임을 알림 + 한국어 지원
        res.writeHead(200, { 'Content-Type' : 'text/html; charset-utf8'});
        const data = await fs.readFile('./server2.html');
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(200, { 'Content-Type' : 'text/html; charset-utf8'});
        res.end(err.message);
    }
    
})
    .listen(8080);
server.on('listening', () => {
    console.log('Server Listening on Port 8080!');
});
server.on('error', (error) => {
    console.error(error);
})