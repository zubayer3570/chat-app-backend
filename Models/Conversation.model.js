const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    _id: String,
    participantsIDs: String,
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: "message"
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation