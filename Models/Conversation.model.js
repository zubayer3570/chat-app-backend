const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    userId_1: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    userId_2: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: "message"
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation