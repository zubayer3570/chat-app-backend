const { isObjectIdOrHexString } = require("mongoose")
const Conversation = require("../Models/Conversation.model")
const People = require("../Models/People.model")

const getConversations = async (req, res) => {
    const { userID } = req.params
    try {
        const conversations = await Conversation.find({ participants: userID })
        const populatedConversation = await Promise.all(conversations.map(async conversation => {
            const peopleInfos = await Promise.all(conversation.participants.map(async (participant) => await People.findOne({ _id: participant }, '-password')))
            conversation.participants = peopleInfos
            return conversation
        }))
        res.send(populatedConversation)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports = {
    getConversations,
}