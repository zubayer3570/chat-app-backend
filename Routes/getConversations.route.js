const express = require("express")
const { getConversations } = require("../Contorllers/conversation.controller")
const router = express.Router()

const getConversationsRoute = router.post('/', getConversations)

module.exports = {
    getConversationsRoute
}