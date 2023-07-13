const express = require("express")
const { getTexts } = require("../Contorllers/messages.controller")
const router = express.Router()

const getTextsRoute = router.post('/', getTexts)

module.exports = {
    getTextsRoute
}