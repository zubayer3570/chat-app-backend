const express = require("express")
const router = express.Router()
const {createConversation, getConversation} = require("../Contorllers/conversation.controller")

const createConversationRouter = router.post('/', createConversation)
const getConversationRouter = router.get('/:userId', getConversation)

module.exports = {
    createConversationRouter,
    getConversationRouter
}