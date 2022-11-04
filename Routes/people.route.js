const express = require("express")
const router = express.Router()
const { createUser, getUsers } = require('../Contorllers/people.controller')

const createUserRouter = router.post('/', createUser)
const getUsersRouter = router.get('/', getUsers)

module.exports = {
    createUserRouter,
    getUsersRouter
}