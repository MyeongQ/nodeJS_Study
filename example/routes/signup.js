const express = require('express');
const User = require('../models/user');

const router = express.Router();

/*
curl -X POST localhost:3000/signup -d 
'{"email" : "abc123@naver.com", "age" : "25", "name" : "Heo", "pw" : "54321"}' 
-H "Content-Type: application/json"
*/
router.route('/')
    .post(async (req, res, next) => {
        try {
            const user = await User.create({
                email: req.body.email,
                pw: req.body.pw,
                name: req.body.name,
                age: req.body.age,
            });
            console.log(user);
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

module.exports = router;