const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")

const addConversation = async (req, res) => {
    // const conversation = req.body
    // const newConversation = new Conversation(conversation)
    // await newConversation.save()
    // await User.updateMany({_id: conversation.participantsIDs.split("###")}, {$push:{conversationIDs: conversation._id}})
    // res.send(newConversation)
    res.send({})
}


const updateUnread = async (req, res) => {
    const { conversationID } = req.body
    const updatedConversation = await Conversation.findOneAndUpdate({ _id: conversationID }, { "lastMessage.unread": false }, { new: true })
    console.log(updatedConversation.lastMessage.unread)
    res.send(updatedConversation)
}


module.exports = {
    updateUnread, addConversation
}