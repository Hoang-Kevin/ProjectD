const mongoose = require('mongoose')
const Schma = mongoose.Schema

const User = new Schema(
    {
        name: { type: String, required: true},
        nickname: {type: String, required: true},
        email: {type: String, required: true},
        picture: {type: URL, required: false},
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', User)