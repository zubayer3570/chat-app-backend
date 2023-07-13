const mongoose = require("mongoose")


const MsgSchema = new mongoose.Schema({
    _id: String,
    conversationID: String,
    sender: Object,
    receiver: Object,
    text: String,
    unread: Boolean
}, { timestamps: true })


const Message = mongoose.model("message", MsgSchema)
module.exports = Message