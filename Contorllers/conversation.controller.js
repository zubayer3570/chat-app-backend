const Conversation = require("../Models/Conversation.model")
const People = require("../Models/People.model")
const { ObjectId } = require('mongoose').Types
const createConversation = async (req, res) => {
    try {
        const conversationData = req.body
        const newConversation = new Conversation(conversationData)
        const response = await newConversation.save()
        await global.io.emit("new_conversation", response)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
}
const getConversation = async (req, res) => {
    const { userId } = req.params
    try {
        const conversations = await Conversation.find({ participants: userId })
        const filtered = conversations.map(conversation => userId == conversation.participants[0] ? conversation.participants[1] : conversation.participants[0])
        const result = await People.find({
            _id: { $in: filtered }
        }, 'username')
        res.send({result, conversations})
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    createConversation,
    getConversation
}