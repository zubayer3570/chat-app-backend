const express = require("express")
const { updateUnread } = require("../Contorllers/conversation.controller")
const router = express.Router()

const updateUnreadRoute = router.post('/', updateUnread)

module.exports = {
    updateUnreadRoute
}