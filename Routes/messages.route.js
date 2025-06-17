const express = require("express")
const router = express.Router()
const { sendMessage, getMessages } = require("../Contorllers/messages.controller")

router.get('/', () => // console.log("hi"))
const getMessagesRouter = router.get('/:conversationID', getMessages)
const sendMsgRouter = router.post('/', sendMessage)


module.exports = {
    sendMsgRouter,
    getMessagesRouter
}