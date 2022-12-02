const Conversation = require("../Models/Conversation.model")
const People = require("../Models/People.model")
const createConversation = async (req, res) => {
    try {
        const participantsIds = req.body.participants
        const participants = await People.find({ _id: participantsIds })
        const newConversation = new Conversation({ participants })
        const conversation = await newConversation.save()
        res.send(conversation)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}
const getConversation = async (req, res) => {
    const { userID } = req.params
    try {
        const conversations = await Conversation.find({ participants: userID })
        const conversationPeopleIDs = conversations.map(conversation => conversation.participants[0] == userID ? conversation.participants[1] : conversation.participants[0])
        const conversationPeople = await People.find({ _id: conversationPeopleIDs })
        res.send({conversationPeople, conversations})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const checkConversation = async (req, res) => {
    const { userID, receiverID } = req.body
    try {
        const conversation = await Conversation.findOne({ participants: [userID, receiverID] })
        res.send(conversation)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports = {
    createConversation,
    getConversation,
    checkConversation
}