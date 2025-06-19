const mongoose = require("mongoose")


const MsgSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
    },
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "conversation"
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    text: String,
    unread: Boolean
}, { timestamps: true })


const Message = mongoose.model("message", MsgSchema)
module.exports = Message