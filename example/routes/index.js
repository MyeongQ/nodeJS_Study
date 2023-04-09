const express = require('express');
const User = require('../models/user');

const router = express.Router();

// curl -X GET localhost:3000
router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({});
        res.json(users);
    } catch(err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;