const express = require("express")
const { addConversation } = require("../Contorllers/conversation.controller")

const router = express.Router()

const addConversationRoute = router.post('/', addConversation)

module.exports = {
    addConversationRoute
}