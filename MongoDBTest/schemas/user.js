const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
    // _id는 생략
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number, // Data Type은 JS를 따름
        required: true,
    },
    married: {
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);