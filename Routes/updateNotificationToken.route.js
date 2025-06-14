const express = require("express")
const { updateNotificationToken } = require("../Contorllers/user.controller")

const router = express.Router()

const notificationTokenRoute = router.post('/', updateNotificationToken)

module.exports = {
    notificationTokenRoute
}