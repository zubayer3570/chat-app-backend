const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const firebase = require("firebase-admin");
const { ObjectId } = require("bson");
const { getIO } = require("../real_time/socket_connection");

const sendText = async (req, res) => {
    try {

        const { message } = req.body
        _id = new ObjectId()

        try {
            if (!message.conversationId) {
                const newConversation = new Conversation({ userId_1: message.sender._id, userId_2: message.receiver._id, lastMessageId: _id })
                const newConversationInserted = await newConversation.save()
                // console.log(newConversationInserted)
                message["conversationId"] = newConversationInserted._id
            }
        } catch (err) {
            console.log(err)
        }

        const newMessage = new Message({ _id, ...message })

        // new message
        getIO().to(data.receiver.email).emit("new_message", data)

        const insertedMessage = await newMessage.save()

        // firebase notification sending
        for (let i = 0; i < message.receiver.notificationToken; i++) {
            await firebase.messaging().send({
                data: {
                    title: message.sender.name,
                    message: "Message: " + message.text,
                    url: "https://chat-app-89528.web.app"
                },
                token: message.receiver.notificationToken[i]
            })
        }

        //sending response to the client
        res.send({ message: insertedMessage })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


const getTexts = async (req, res) => {
    const { conversationId } = req.body
    try {
        const conversations = await Message.find({ conversationId }).populate(["sender", "receiver"])
        res.send(conversations)
    } catch (error) {
        console.log(error)
        res.send([])
    }
}

module.exports = {
    sendText,
    getTexts
}