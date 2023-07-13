const express = require("express")
const { getAllUsers } = require("../Contorllers/people.controller")

const router = express.Router()

const allUsersRoute = router.get('/', getAllUsers)

module.exports = {
    allUsersRoute
}