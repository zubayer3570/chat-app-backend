const Message = require("../Models/Msg.model")
const People = require("../Models/People.model")
const Conversation = require("../Models/Conversation.model")
const sendMessage = async (req, res) => {
    try {
        const messageData = req.body
        let conversationID = messageData.conversationID
        if (!conversationID) {
            console.log(messageData)
            const participants = [messageData.sender.senderID, messageData.receiver.receiverID]
            const newConversation = new Conversation({ participants })
            const insertedConversation = await newConversation.save()
            conversationID = insertedConversation._id.valueOf()
            messageData.conversationID = conversationID
        }
        const newMessage = new Message(messageData)
        newMessage.save()
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getMessages = async (req, res) => {
    const { conversationID } = req.params
    try {
        const conversations = await Message.find({ conversationID })
        res.send(conversations)
    } catch (error) {
        res.send([])
    }
}

module.exports = {
    sendMessage,
    getMessages
}