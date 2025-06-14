const express = require("express")
const { loginUser } = require("../Contorllers/user.controller")
const router = express.Router()

const loginUserRouter = router.post('/', loginUser)

module.exports = {
    loginUserRouter
}