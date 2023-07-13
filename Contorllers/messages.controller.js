const { nanoid } = require("nanoid")
const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")


const sendText = async (req, res) => {
    // Saving message to database
    try {
        const { sender, receiver, text } = req.body
        const message = { _id: nanoid(), sender, receiver, text }

        const conversationID = await Conversation.findOne({ participantsIds: [sender._id + "###" + receiver._id, receiver._id + "###" + sender._id] }, "_id")

        if (!conversationID) {
            // Manually creating a conversation ID
            const genConvoId = nanoid()

            // setting that ID in message's conversationID
            message.conversationID = genConvoId

            // pushing that id to both sender's and receiver's document
            await User.updateMany({ _id: [sender._id, receiver._id] }, { $push: { conversationIDs: genConvoId } })

            // creating a new conversation document with the ID
            const newConversation = new Conversation({
                participantsIds: sender._id + "###" + receiver._id,
                lastMessage: message,
                _id: genConvoId
            })

            await newConversation.save()
        }

        if (conversationID) {
            message.conversationID = conversationID
        }

        // inserting new message
        const newMessage = new Message(message)
        const insertedMessage = await newMessage.save()

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