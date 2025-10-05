const { ObjectId } = require("bson")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")
const Message = require("../Models/Message.model")
const { getIO } = require("../real_time/socket_connection");


const createNewConversation = async (req, res) => {
    try {

        const { sender, receiver } = req.body
        // console.log(sender, receiver)
        const newConvId = new ObjectId()
        const newConversation = new Conversation({ _id: newConvId, userId_1: sender._id, userId_2: receiver._id, lastMessage: null })
        const insertedNewConversation = await newConversation.save()

        const new_conv = { _id: newConvId, userId_1: sender, userId_2: receiver, lastMessage: null }

        getIO()
            .to([sender.email, receiver.email])
            .emit("new_conversation", { conversation: new_conv })

        res.send({ newConversation: insertedNewConversation })

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


const getConversations = async (req, res) => {
    try {
        const { userId } = req.body
        await Conversation.deleteMany({lastMessage: null})
        const conversations = await Conversation.find({ $or: [{ userId_1: userId }, { userId_2: userId }] })
            .populate({ path: "userId_1 userId_2 lastMessage" })
            .sort({ updatedAt: "-1" })
        console.log(conversations)

        res.send({ conversations })
    } catch (error) {
        console.log(error)
        res.send({ message: "something went wrong!" })
    }
}


const updateUnread = async (req, res) => {
    try {
        const { lastMessage } = req.body
        const updatedMessage = await Message.findOneAndUpdate({ _id: lastMessage?._id }, { unread: false }, { new: true }).populate(["sender", "receiver"])
        res.send({ updatedMessage })
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    createNewConversation,
    getConversations,
    updateUnread,
}