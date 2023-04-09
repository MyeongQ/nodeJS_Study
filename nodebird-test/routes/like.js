const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User, Post } = require('../models');

const router = express.Router();

router.post('/:post_id', isLoggedIn, async (req, res, next ) => {
    try {
        const user = await User.findOne({ where: {  id: req.user.id } });
        if (user) {
            await user.addLike(parseInt(req.params.post_id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    };
});

router.delete('/:post_id', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: {  id: req.user.id } });
        if (user) {
            await user.removeLike(parseInt(req.params.post_id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    };
})

module.exports = router;