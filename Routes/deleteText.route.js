const express = require("express")
const { deleteMessage } = require("../Contorllers/messages.controller")
const router = express.Router()

const deleteTextRoute = router.post('/', deleteMessage)

module.exports = {
    deleteTextRoute
}