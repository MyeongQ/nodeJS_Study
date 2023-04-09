const { addFollowing_ }  = require('./user');
jest.mock('../models/user');
const User = require('../models/user');

describe('addFollwing_', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn()
    test('사용자를 찾아 팔로잉 추가 & success를 응답', async () => {
        User.findOne.mockReturnValue(Promise.resolve({ 
            id: 1, 
            name: 'Mike',
            addFollowing(value) {
                return Promise.resolve.true
            }
        }));
        await addFollowing_(req, res, next);
        // 예상되는 결과
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출', async () => {
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing_(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    test('DB에서 에러가 발생하면 next(error) 호출', async () => {
        const error = '테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing_(req, res, next);
        expect(next).toBeCalledWith(error);
    });
})