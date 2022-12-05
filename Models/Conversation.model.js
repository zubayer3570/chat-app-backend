const mongoose = require("mongoose")

const MsgSchema = new mongoose.Schema({
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

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [],
        required: true
    },
    messages: {
        type: [MsgSchema],
        required: true,
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation