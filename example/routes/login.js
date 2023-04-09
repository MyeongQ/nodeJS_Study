const express = require('express');
const User = require('../models/user');

const router = express.Router();

// curl -X GET localhost:3000/login?email=gmk0904@ajou.ac.kr&pw=12345
router.route('/')
    .get(async (req, res, next) => {
        try {
            const user = await User.findOne({
                email: req.query.email,
                pw: req.query.pw,
            });
            console.log("로그인 성공! ", user);
            res.status(200).json(user);
        } catch (err) {
            console.error("일치하는 정보가 없습니다.");
            next(err);
        }
    });

module.exports = router;