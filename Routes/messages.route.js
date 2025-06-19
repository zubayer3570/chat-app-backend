const express = require("express")
const router = express.Router()
const { sendMessage, getMessages } = require("../Contorllers/messages.controller")

const getMessagesRouter = router.get('/:conversationId', getMessages)
const sendMsgRouter = router.post('/', sendMessage)


module.exports = {
    sendMsgRouter,
    getMessagesRouter
}