const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const firebase = require("firebase-admin");

const sendText = async (req, res) => {
    // Saving message to database
    try {
        const message = req.body
        console.log(message)
        const newMessage = new Message(message)
        const insertedMessage = await newMessage.save()
        await Conversation.updateOne({ _id: message.conversationID }, { $set: { lastMessage: message } })
        await firebase.messaging().send({
            data: {
                title: message.sender.name,
                message: "Message: " + message.text
            },
            token: "crr93cKfgl7zT6y8790kQo:APA91bF8ke_wd8WjrEV1Ah39zMmJOFmu5EN4P649kEd2vhBTK8Nn_R_Aqp4NqFiyVvn6gzRaqhcMFWotS_uNFrmERfXGNw19TVC_10UZIJMIkbsqWWbvb3sEoeiH4X_iBk6VnwACyWk8"
        })

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