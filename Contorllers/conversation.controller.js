const Conversation = require("../Models/Conversation.model")
const People = require("../Models/People.model")
const getConversation = async (req, res) => {
    const { participants } = req.body
    try {
        const populatedPariticipants = await Promise.all(participants.map(async (participantID) => await People.findOne({ _id: participantID }, '-password')))
        const conversation = await Conversation.findOne({ participants })
        if (conversation) {
            // editing the conversation object, and sending the edited version of it, with the user credentials
            conversation.participants = populatedPariticipants
            res.send({ conversation })
        } else {
            const newConversation = new Conversation({ participants })
            const insertedConversation = await newConversation.save()
            // editing the conversation object, and sending the edited version of it, with the user credentials
            insertedConversation.participants = populatedPariticipants
            res.send({ conversation: insertedConversation })
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}
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
    getConversation,
    getConversations,
}