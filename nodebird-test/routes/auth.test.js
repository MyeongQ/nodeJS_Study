const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
});

describe('POST /join', () => {
    test('로그인 안했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'gmk0904@ajou.ac.kr',
                nick: '공명규',
                password: '9dnjf4dlf',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('로그인 수행', (done) => {
        request(app)
            .post('/auth/login')  // 로그인 라우터
            .send({
                email: 'gmk0904@ajou.ac.kr',
                password: '9dnjf4dlf',
            })
            .expect('Location', '/') // 예상 응답
            // async&await이 아닌 then, promise 등 비동기는 done 필수
            .expect(302, done); 
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });  // 테이블 초기화
})