const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

// 쿠키를 객체로 만들어줌
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    // 주소가 /login으로 시작
    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        // 쿠키 유효시간 = 현재시간 + 5분
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location: '/', // Redirection
            'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();

        // name이라는 쿠키가 있을 경우
    } else if (cookies.name) {
        res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요!`);
    } else {
        try {
            const data = await fs.readFile('./cookie2.html');
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(data);
        } catch (err) {
            res.writeHead(500, {'Content-Type' : 'text/plain; charset=utf-8'});
            res.end(err.message);
        }
    }
})
    .listen(8080, () => {
        console.log('Server Listening on Port 8080');
    })