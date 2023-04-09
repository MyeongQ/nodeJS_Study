const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const chatSchema = new Schema({
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',  // 속성을 개체 room으로 대체
        
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);