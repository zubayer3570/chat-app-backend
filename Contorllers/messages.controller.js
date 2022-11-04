const Msg = require("../Models/Msg.model")
const People = require("../Models/People.model")
const { ObjectId } = require('mongoose').Types
const sendMsg = async (req, res) => {
    try {
        const msgData = req.body
        msgData.conversationId = ObjectId(msgData.conversationId)
        const newMsg = new Msg(msgData)
        const response = await newMsg.save()
        await io.emit('new_msg', response) 
        res.send(response)
    } catch (error) {
        res.send(error)
    }
}
const getMsgs = async (req, res) => {
    const { conversationId } = req.params
    try {
        const conversations = await Msg.find({ conversationId })
        res.send(conversations)
    } catch (error) {
        res.send([])
    }
}

module.exports = {
    sendMsg,
    getMsgs
}