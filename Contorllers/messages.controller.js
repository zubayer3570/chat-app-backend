const { nanoid } = require("nanoid")
const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")


const sendText = async (req, res) => {
    // Saving message to database
    try {
        const message = req.body
        const newMessage = new Message(message)
        const insertedMessage = await newMessage.save()
        await Conversation.updateOne({ _id: message.conversationId }, { lastMessage: message })

        //sending response to the client
        res.send(insertedMessage)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


const getTexts = async (req, res) => {
    const { conversationID } = req.body
    try {
        const conversations = await Message.find({ conversationID })
        res.send(conversations)
    } catch (error) {
        res.send([])
    }
}

module.exports = {
    sendText,
    getTexts
}