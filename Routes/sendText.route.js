const express = require("express")
const { sendText } = require("../Contorllers/messages.controller")
const router = express.Router()

const sendTextRoute = router.post('/', sendText)

module.exports = {
    sendTextRoute
}