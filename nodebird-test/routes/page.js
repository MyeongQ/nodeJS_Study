const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag, Like } = require('../models');
const bcrypt = require('bcrypt');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user; // 모든 라우터에서 req.user가 쓰일 수 있으므로 위에 선언
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    res.locals.likeList = req.user ? req.user.Likes.map(p => p.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원 가입 - NodeBird'});
});

router.get('/update', isLoggedIn, (req, res) => {
    res.render('update', { title: '정보 수정 - NodeBird' });
});

// put???
router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const { nick, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        await User.update(
            { 
                nick,
                password: hash,
            }, 
            { where: { id: req.user.id } }
        )
        console.log('정보 수정 완료');
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        console.log(posts);
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    
});
// GET /hashtag?hashtag=노드
router.get('/hashtag', async(req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User, attribute: [ 'id', 'nick' ] }] });
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;