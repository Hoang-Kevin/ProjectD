const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Task = new Schema(
    {
        title: { type: String, required: true},
        starttime: {type: Date, required: false},
        endtime: {type: Date, required: false},
        currentProcess: {type: Number, required: true, default: 0},
        ressources: [String]
    },
    { timestamps: true },
)

module.exports = mongoose.model('task', Task)