const express = require("express")
const { updateMessage } = require("../Contorllers/messages.controller")
const router = express.Router()

const updateMessageRoute = router.post('/', updateMessage)

module.exports = {
    updateMessageRoute
}