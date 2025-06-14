const mongoose = require("mongoose")


const MsgSchema = new mongoose.Schema({
    conversationID: {
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