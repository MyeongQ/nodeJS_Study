const express = require('express');
const User = require('../models/user');
const Article = require('../models/article');

const router = express.Router();

// curl -X GET localhost:3000/article
router.route('/')
    .get(async (req, res, next) => {
        try {
            const articles = await Article.findAll();
            res.json(articles);
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
/*
curl -X POST localhost:3000/article -d 
'{"title" : "킹받네", "text" : "길가다 돌 맞음", "id" : "002"}' 
-H "Content-Type: application/json"
*/
    .post(async (req, res, next) => {
        try {
            const article = await Article.create({
                title: req.query.title,
                text: req.query.text,
                writer: req.query.id,
            });
            console.log(article);
            res.status(201).json(article);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

//curl -X GET localhost:3000/article/002
router.get('/:id', async (req, res, next) => {
    try {
        const articles = await Article.findAll({
            // include: {
            //     model: User,
            //     where: { writer: req.params.id },
            // },
            where: {writer: req.params.id,},
        });
        console.log(articles);
        res.json(articles);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;

