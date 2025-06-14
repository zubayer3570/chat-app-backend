const express = require("express")
const { getAllUsers } = require("../Contorllers/user.controller")

const router = express.Router()

const allUsersRoute = router.get('/', getAllUsers)

module.exports = {
    allUsersRoute
}