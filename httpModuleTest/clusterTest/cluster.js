const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    // CPU 개수만큼 워커 생산
    for (let i = 0; i < numCPUs; i+=1){
        cluster.fork();
    }
    // 워커 종료시
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커 종료`);
        console.log('code', code, 'signal', signal);
        cluster.fork();  // 워커 종료시 다른 워커 실행
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Server!</p>');
        setTimeout(() => { // 워커 존재를 확인하기 위해 1초마다 종료
            process.exit(1);
        }, 1000);
    }).listen(8080) //동일한 포트로 서버 생성 가능
    console.log(`${process.pid}번 워커 실행`);
}
