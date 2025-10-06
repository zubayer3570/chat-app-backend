const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const firebase = require("firebase-admin");
const { ObjectId } = require("bson");
const { getIO } = require("../real_time/socket_connection");
const jwt = require("jsonwebtoken")

const sendText = async (req, res) => {
    try {

        const { message } = req.body
        _id = new ObjectId()

        let new_conv = null

        try {
            if (!message.conversationId) {
                const newConvId = new ObjectId()
                const newConversation = new Conversation({ _id: newConvId, userId_1: message.sender._id, userId_2: message.receiver._id, lastMessage: _id })
                const newConversationInserted = await newConversation.save()
                message["conversationId"] = newConversationInserted._id
                new_conv = { _id: newConvId, userId_1: message.sender, userId_2: message.receiver, lastMessage: message }
            }
        } catch (err) {
            console.log(err)
        }

        const newMessage = new Message({ _id, ...message })
        // res.send({ message: newMessage })



        // new message
        // console.log(message.sender.email, message.receiver.email)
        // console.log({ message: { ...newMessage.toObject(), receiver: message.receiver, sender: message.sender } })

        console.log("new_conv", new_conv)

        if (new_conv) {
            console.log("emitting new conversation")
            console.log([message.sender.email, message.receiver.email])
            getIO()
                .to([message.sender.email, message.receiver.email])
                .emit("new_conversation", { conversation: new_conv })
        }

        const ret = getIO()
            .to([message.sender.email, message.receiver.email])
            .emit("new_message", { message: { ...newMessage.toObject(), receiver: message.receiver, sender: message.sender } })

        newMessage.save()
        await Conversation.updateOne({ _id: newMessage.conversationId }, { lastMessage: _id })

        // // firebase notification sending
        // for (let i = 0; i < message.receiver.notificationToken; i++) {
        //     await firebase.messaging().send({
        //         data: {
        //             title: message.sender.name,
        //             message: "Message: " + message.text,
        //             url: "http://localhost:3000"
        //         },
        //         token: message.receiver.notificationToken[i]
        //     })
        // }

        res.send({ message: { ...newMessage.toObject(), receiver: message.receiver, sender: message.sender } })

        //sending response to the client
        // res.send({ message: insertedMessage })
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


const updateMessage = async (req, res) => {
    const { textDetails, text } = req.body
    console.log("textDetails-------------------------------", textDetails)
    console.log("text-------------------", text)
    const userDetails = jwt.decode(req.headers["authorization"] && req.headers["authorization"].split(" ")[1], process.env.JWT_SECRET)

    try {
        if (textDetails.sender._id == userDetails.user._id) {
            const updatedMessage = await Message.findOneAndUpdate({ _id: textDetails._id }, { text }, { new: true }).populate(["sender", "receiver"])
            console.log(updatedMessage)
            const ret = getIO()
                .to([textDetails.receiver.email, textDetails.sender.email])
                .emit("message_updated", { updatedMessage })
            res.send({ updatedMessage })
        } else {
            res.status(403).send("you are not allowed to update this message")
        }
    } catch (error) {
        console.log(error)
        res.send([])
    }
}


const deleteMessage = async (req, res) => {
    const { textDetails } = req.body
    const userDetails = jwt.decode(req.headers["authorization"] && req.headers["authorization"].split(" ")[1], process.env.JWT_SECRET)

    try {
        if (textDetails.sender._id == userDetails.user._id) {
            const deletedMessage = await Message.findOneAndDelete({ _id: textDetails._id })
            const ret = getIO()
                .to([textDetails.receiver.email, textDetails.sender.email])
                .emit("message_deleted", { deletedMessage })
            res.send({ deletedMessage })
        } else {
            res.status(403).send("you are not allowed to delete this message")
        }
    } catch (error) {
        console.log(error)
        res.send([])
    }
}

module.exports = {
    sendText,
    getTexts,
    updateMessage,
    deleteMessage
}