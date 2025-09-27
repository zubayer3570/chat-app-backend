const { ObjectId } = require("bson")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")
const Message = require("../Models/Message.model")


const getConversations = async (req, res) => {
    try {
        const { userId } = req.body

        const conversations = await Conversation.find({ $or: [{ userId_1: userId}, {userId_2: userId }] })
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
    updateUnread,
    getConversations
}