const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();  // 이후 나오는 줄에 .env 적용 (가능한 위에 선언)
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const likeRouter = require('./routes/like');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001); // 배포시 .env에 PORT 추가
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
// force : true로 하면 테이블을 지우고 다시 생성
// alter : true로 하면 수정된 테이블과 기존 데이터가 맞지 않아 error 발생
// 또는 직접 테이블 수정 (권장)
sequelize.sync({ force: false })  
    .then(() => {
        console.log('DB 연결 성공');
    }).catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/like', likeRouter);

// 라우터에서 요청처리 못할 경우 에러 미들웨어로
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // 템플릿 엔진에서 message, error 사용할 수 있게
    res.locals.message = err.message;
    // 개발 모드에서는 error trace 노출
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500).render('error');
});

module.exports = app;