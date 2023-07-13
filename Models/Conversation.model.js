const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    _id: String,
    participantsIds: String,
    lastMessage: Object
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation