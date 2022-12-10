const express = require("express")
const router = express.Router()
const { getConversations, getConversation } = require("../Contorllers/conversation.controller")

const getConversationsRouter = router.get('/:userID', getConversations)
const getConversationRouter = router.post('/', getConversation)

module.exports = {
    getConversationsRouter,
    getConversationRouter
}