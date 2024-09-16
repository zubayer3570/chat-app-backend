const mongoose = require("mongoose")


const MsgSchema = new mongoose.Schema({
    _id: String,
    conversationID: String,
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "people"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: "people",
    },
    text: String,
    unread: Boolean
}, { timestamps: true })


const Message = mongoose.model("message", MsgSchema)
module.exports = Message