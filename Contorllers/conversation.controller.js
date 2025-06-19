const { ObjectId } = require("bson")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")
const Message = require("../Models/Message.model")

const addConversation = async (req, res) => {
    try {
        const { newConversation, message } = req.body
        const insertedConversation = new Conversation({ _id: new ObjectId(), ...newConversation })
        await insertedConversation.save()

        const insertedMessage = new Message({ _id: new ObjectId(), conversationId: insertedConversation._id, ...message })
        insertedMessage.save()

        const updatedConversation = await Conversation.findOneAndUpdate({ _id: insertedConversation?._id }, { lastMessage: insertedMessage._id }, { new: true })

        await User.updateMany({ _id: newConversation.participantsIDs.split("###") }, { $push: { conversationIds: insertedConversation._id } })

        const fetchedNewConversaton = await Conversation.findOne({ _id: updatedConversation._id })
            .populate({ path: "lastMessage", populate: { path: "receiver" } })
            .populate({ path: "lastMessage", populate: { path: "sender" } })

        // console.log("this is fetched", fetchedNewConversaton)
        res.send({ newConversation: fetchedNewConversaton })
    } catch (err) {
        // console.log(err)
    }
}

const getConversations = async (req, res) => {
    try {
        const { userId } = req.body
        // const conversations = await Conversation.find({ $or: [{ userId_1: userId, userId_2: userId }] })
        const conversations = await Conversation.find({ $or: [{ userId_1: userId}, {userId_2: userId }] })
            .populate({ path: "userId_1 userId_2 lastMessageId" })
            .sort({ updatedAt: "-1" })
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
        // console.log(err)
    }
}


module.exports = {
    updateUnread,
    addConversation,
    getConversations
}