const mongoose = require("mongoose")
const MsgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })
const MsgModel = mongoose.model("message", MsgSchema)
module.exports = MsgModel