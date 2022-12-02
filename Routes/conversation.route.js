const express = require("express")
const router = express.Router()
const { getConversation, checkConversation} = require("../Contorllers/conversation.controller")

const getConversationRouter = router.get('/:userID', getConversation)
const checkConversationRouter = router.post('/', checkConversation)

module.exports = {
    getConversationRouter,
    checkConversationRouter
}