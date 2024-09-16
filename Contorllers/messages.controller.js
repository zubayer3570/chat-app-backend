const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const firebase = require("firebase-admin");
const { ObjectId } = require("bson");

const sendText = async (req, res) => {
    // Saving message to database
    try {
        const message = req.body
        const newMessage = new Message({ _id: new ObjectId(), ...message })
        const insertedMessage = await newMessage.save()

        await Conversation.updateOne({ _id: message.conversationID }, { $set: { lastMessage: newMessage._id } })

        // firebase notification sending
        await firebase.messaging().send({
            data: {
                title: message.sender.name,
                message: "Message: " + message.text,
                url: "https://chat-app-89528.web.app"
            },
            token: message.receiver.notificationToken
        })

        //sending response to the client
        res.send({ message: insertedMessage })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


const getTexts = async (req, res) => {
    const { conversationID } = req.body
    try {
        const conversations = await Message.find({ conversationID }).populate(["sender", "receiver"])
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