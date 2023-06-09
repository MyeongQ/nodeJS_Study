const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { addFollowing_ } = require('../controllers/user');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing_)
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        } 
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;