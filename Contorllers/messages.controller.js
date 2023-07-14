const { nanoid } = require("nanoid")
const Message = require("../Models/Message.model")
const Conversation = require("../Models/Conversation.model")
const User = require("../Models/User.model")


const sendText = async (req, res) => {
    // Saving message to database
    try {
        const { sender, receiver, text, unread, conversationID } = req.body
        delete sender.conversations
        const message = { _id: nanoid(), sender, receiver, text, unread }
        if (conversationID) {
            message.conversationID = conversationID
            await Conversation.updateOne({ _id: conversationID }, { $set: { lastMessage: message } })
            io.to(activeUsers.get(sender.email)).to(activeUsers.get(receiver.email)).emit("new_last_message", message)
        }

        if (!conversationID) {
            // Manually creating a conversation ID
            const genConvoId = nanoid()

            // setting that ID in message's conversationID
            message.conversationID = genConvoId

            // pushing that id to both sender's and receiver's document
            await User.updateMany({ _id: [sender._id, receiver._id] }, { $push: { conversationIDs: genConvoId } })

            // creating a new conversation document with the ID
            const createdConversation = {
                participantsIds: sender._id + "###" + receiver._id,
                lastMessage: message,
                _id: genConvoId
            }

            // socket
            io.to(activeUsers.get(sender.email)).to(activeUsers.get(receiver.email)).emit("new_conversation", createdConversation)

            const newConversation = new Conversation(createdConversation)
            await newConversation.save()
        }


        // socket
        io.to(activeUsers.get(sender.email)).to(activeUsers.get(receiver.email)).emit("new_message", message)

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