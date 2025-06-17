const express = require("express")
const { refresh } = require("../Contorllers/user.controller")

const router = express.Router()

const refreshTokenRoute = router.post('/', refresh)

module.exports = {
    refreshTokenRoute
}