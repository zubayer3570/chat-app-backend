const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [],
        required: true
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation