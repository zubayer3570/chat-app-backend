const Message = require("../Models/Msg.model")
const Conversation = require("../Models/Conversation.model")
const sendMessage = async (req, res) => {
    try {
        const messageData = req.body
        let conversationID = messageData.conversationID
        const message = {
            sender: messageData.sender,
            receiver: messageData.receiver,
            text: messageData.text
        }
        if (!conversationID) {
            console.log(messageData)
            const participants = [messageData.sender.senderID, messageData.receiver.receiverID]
            const newConversation = new Conversation({
                participants,
                messages: [message]
            })
            const savedMessage = await newConversation.save()
            res.send(savedMessage)
        } else {
            const foundConversation = await Conversation.findOne({ _id: conversationID })
            const update = [...foundConversation.messages, message]
            const updatedDocument = await Conversation.findOneAndUpdate({ _id: conversationID }, { messages: update }, { new: true })
            res.send(updatedDocument)
        }
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