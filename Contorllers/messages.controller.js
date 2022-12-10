const Message = require("../Models/Msg.model")
const Conversation = require("../Models/Conversation.model")
const sendMessage = async (req, res) => {
    // Saving message to database
    try {
        const { sender, receiver, text, conversationID } = req.body
        const message = { sender, receiver, text, conversationID }
        // inserting new message
        const newMessage = new Message(message)
        const insertedMessage = await newMessage.save()

        //sending message to socket
        const selectedUser = activeUsers.find(activeUser => activeUser.userID == receiver.receiverID)
        io.to(selectedUser?.socketID).emit("new_message", insertedMessage)

        //sending response to the client
        res.send(insertedMessage)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getMessages = async (req, res) => {
    const { conversationID } = req.params
    try {
        const conversations = await Message.find({ conversationID })
        res.send(conversations)
    } catch (error) {
        res.send([])
    }
}

module.exports = {
    sendMessage,
    getMessages
}