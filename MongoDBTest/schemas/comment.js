const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema; // 구조분해 할당으로 ObjectId 꺼냄
const commentSchema = new Schema({
    commenter: {
        type: ObjectId, // 또는 mongoose.Schema.Types.ObjectId
        required: true,
        ref: 'User',  // 외래키 속성 <= userSchema : JOIN(populate) 가능
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);