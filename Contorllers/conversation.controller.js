const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")

const addConversation = async (req, res) => {
    const conversation = req.body
    const newConversation = new Conversation(conversation)
    await newConversation.save()
    await User.updateMany({_id: conversation.participantsIDs.split("###")}, {$push:{conversationIDs: conversation._id}})
    res.send(newConversation)
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

const updateUnread = async (req, res) => {
    const { conversationID } = req.body
    const updatedConversation = await Conversation.findOneAndUpdate({ _id: conversationID }, { "lastMessage.unread": false }, { new: true })
    console.log(updatedConversation.lastMessage.unread)
    res.send(updatedConversation)
}


module.exports = {
    getConversations, updateUnread, addConversation
}