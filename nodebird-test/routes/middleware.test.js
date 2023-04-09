const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 주로 if문 분기로 test 코드 작성
describe('isLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    test('로그인이 되어있으면 isLoggedIn이 next 호출', () => {
        const req = { // 테스트용 가짜 객체 생성
            isAuthenticated: jest.fn(() => true )
        }; 
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1); // 1번 호출되는지 테스트
    });
    test('로그인이 되어있지 않으면 isLoggedIn이 erorr 응답', () => {
        const req = { // 테스트용 가짜 객체 생성
            isAuthenticated: jest.fn(() => false )
        }; 
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403); // 1번 호출되는지 테스트
        expect(res.send).toBeCalledWith('로그인 필요');
    });

});

describe('isNotLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
        redirect: jest.fn(),
    };
    const next = jest.fn();
    test('로그인이 되어있으면 isNotLoggedIn이 erorr 응답', () => {
        const req = { // 테스트용 가짜 객체 생성
            isAuthenticated: jest.fn(() => true )
        }; 
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req, res, next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    test('로그인이 되어있지 않으면 isNotLoggedIn이 next 호출', () => {
        const req = { // 테스트용 가짜 객체 생성
            isAuthenticated: jest.fn(() => false )
        }; 
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1); // 1번 호출되는지 테스트
    });
});
