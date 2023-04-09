const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 user의 id만 저장 > 메모리 효율
  });

  // { id: 3, 'connect.sid': s%321937626312 }

  passport.deserializeUser((id, done) => {
    User.findOne({ 
        where: { id },
        include: [{
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followers',
        }, {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Followings',
        }],
    })  // id로 user를 찾아 req.user로 접근 가능하게 만듦
      .then(user => done(null, user)) // req.user, req.isAuthenticated()
      .catch(err => done(err));
  });

  local();
  kakao();
};