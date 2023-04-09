const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {  // 로그인 여부를 true/false로 반환
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
};
  
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) => {
  try {
    // 인증 성공시 토큰 내용이 반환되어 req.doceded에 저장
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);  // verify(토큰, 비밀키)
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

exports.apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 1분
  max: 5,
  delayMs: 1000, // 최소 요청 간격
  handler(req, res) {
    console.log("request: ", req.headers);
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 한 번씩만 요청 가능',
    });
  },
});

exports.apiLimiter_premium = RateLimit({
  windowMs: 60 * 1000, // 1분
  max: 1000,
  delayMs: 1000, // 최소 요청 간격
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 한 번씩만 요청 가능',
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새 버전으로 사용하세요.',
  });
};
