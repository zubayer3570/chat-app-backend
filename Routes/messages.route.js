const express = require("express")
const router = express.Router()
const { sendMsg, getMsgs } = require("../Contorllers/messages.controller")

const sendMsgRouter = router.post('/', sendMsg)
const getMsgRouter = router.get('/:conversationId', getMsgs)

module.exports = {
    sendMsgRouter,
    getMsgRouter
}