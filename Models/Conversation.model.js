const mongoose = require("mongoose")
const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Types.ObjectId],
        required: true
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation