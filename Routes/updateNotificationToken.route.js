const express = require("express")
const { updateNotificationToken } = require("../Contorllers/people.controller")

const router = express.Router()

const notificationTokenRoute = router.post('/', updateNotificationToken)

module.exports = {
    notificationTokenRoute
}