const mongoose = require("mongoose")
const MsgSchema = new mongoose.Schema({
    conversationID: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    sender: {
        type: Object,
        required: true
    },
    receiver: {
        type: Object,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })
const Message = mongoose.model("message", MsgSchema)
module.exports = Message