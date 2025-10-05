const express = require("express")
const { createNewConversation } = require("../Contorllers/conversation.controller")
const router = express.Router()

const createNewConversationRouter = router.post('/', createNewConversation)

module.exports = {
    createNewConversationRouter
}