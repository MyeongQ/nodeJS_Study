const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter, apiLimiter_premium } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// cors 검사 라우터
router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host }
    });
    if (domain) {
        cors({ // 또는 API로 제공하고 싶은 라우터에만 작성
            origin: true,
            credentials: true,
        }) (req, res, next); // 미들웨어 확장 패턴
    } else {
        next();
    }
})
// limit 검사 api
router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host },
    });
    if (domain.type === 'premium') {
        apiLimiter_premium(req, res, next);
    } else {
        apiLimiter(req, res, next);
    }
});

router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { frontSecret: clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
            });
        }
        // 토큰 발급
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m', //1분
            issuer: 'nodebird',
        });

        // 모든 도메인에 대해 CORS 허용
        // res.setHeader('Access-Control-Allow-Origin', '*'); 
        // 브라우저에서 서버로 요청시 쿠키도 함께 전달 허용
        // res.setHeader('Access-Control-Allow-Credentials', 'true'); 
        // 또는 app.use(cors()) 사용

        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
    
});

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if(!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

router.get('/followers/:id', verifyToken, async (req, res) => {
    try {
        const target = await User.findOne({ 
            where: { id: req.params.id } 
        });
        if(!target) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }
        const followers = await target.getFollowers();
        return res.json({
            code: 200,
            payload: followers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

router.get('/followings/:id', verifyToken, async (req, res) => {
    try {
        const target = await User.findOne({ 
            where: { id: req.params.id } 
        });
        if(!target) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }
        const followings = await target.getFollowings();
        return res.json({
            code: 200,
            payload: followings,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

module.exports = router;