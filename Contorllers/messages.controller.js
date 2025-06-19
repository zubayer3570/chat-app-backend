const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const firebase = require("firebase-admin");
const { ObjectId } = require("bson");

const sendText = async (req, res) => {
    // Saving message to database
    try {

        const { message } = req.body
        _id = new ObjectId()

        try {
            if (!message.conversationId) {
                const newConversation = new Conversation({ userId_1: message.sender, userId_2: message.receiver, lastMessageId: _id })
                const newConversationInserted = await newConversation.save()
                console.log(newConversationInserted)
                message["conversationId"] = newConversationInserted._id
            }
        } catch (err) {
            console.log(err)
        }

        const newMessage = new Message({ _id, ...message })
        const insertedMessage = await newMessage.save()

        await Conversation.updateOne({ _id: message.conversationId }, { $set: { lastMessage: newMessage._id } })


        const fetchedMessage = await Message.findOne({ _id: newMessage._id }).populate(["sender", "receiver"])

        // firebase notification sending
        for (let i = 0; i < fetchedMessage.receiver.notificationToken; i++) {
            await firebase.messaging().send({
                data: {
                    title: fetchedMessage.sender.name,
                    message: "Message: " + fetchedMessage.text,
                    url: "https://chat-app-89528.web.app"
                },
                token: fetchedMessage.receiver.notificationToken[i]
            })
        }

        //sending response to the client
        res.send({ message: insertedMessage })
    } catch (error) {
        // console.log(error)
        res.send(error)
    }
}


const getTexts = async (req, res) => {
    const { conversationId } = req.body
    try {
        const conversations = await Message.find({ conversationId }).populate(["sender", "receiver"])
        res.send(conversations)
    } catch (error) {
        // console.log(error)
        res.send([])
    }
}

module.exports = {
    sendText,
    getTexts
}