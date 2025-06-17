const express = require("express")
const { getAllUsers } = require("../Contorllers/user.controller")
const {jwt_verification} = require("../middlewares/jwt_verificatoin")

const router = express.Router()

const allUsersRoute = router.get('/', jwt_verification, getAllUsers)

module.exports = {
    allUsersRoute
}