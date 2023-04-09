const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// uploads 폴더가 없으면 만들어줌
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 용량 제한
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    // 실제 주소는 uploads, 요청 주소는 img
    // url을 front로 돌려보내 다음 게시물 작성시 이미지 경로와 함께 전송 가능
    res.json({ url: `/img/${req.file.filename}`});
});

const upload2 = multer();
// 업로드할 이미지가 없으므로 upload.none
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g);  // 정규 표현식으로 hashtag 추출
        if (hashtags) {
            const result = await Promise.all( //?
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({  // [[있는거, false], [없는거, true]]
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (err) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try{
        const myId = req.user.id;
        const post = await Post.findOne({ where: { id: req.params.postId } });
        console.log(post);
        if (myId === post.UserId ) {
            await Post.destroy({ where: { id: post.id } });
            res.send('success');
        } else {
            res.status(404).send('게시물 삭제 실패');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;