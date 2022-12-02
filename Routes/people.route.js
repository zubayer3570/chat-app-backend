const express = require("express")
const router = express.Router()
const { createUser, getUsers, getUser } = require('../Contorllers/people.controller')

const createUserRouter = router.post('/', createUser)
const getUsersRouter = router.get('/', getUsers)
const getUserRouter = router.get('/:userID', getUser)

module.exports = {
    createUserRouter,
    getUsersRouter,
    getUserRouter
}