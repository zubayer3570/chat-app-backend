const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    _id: String,
    participantsIDs: String,
    lastMessage: Object
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation