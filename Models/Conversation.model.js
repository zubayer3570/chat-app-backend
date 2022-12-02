const mongoose = require("mongoose")
const { PeopleSchema } = require("./People.model")
const ConversationSchema = new mongoose.Schema({
    participants: {
        type: [],
        required: true
    }
}, { timestamps: true })
const Conversation = mongoose.model("conversation", ConversationSchema)
module.exports = Conversation