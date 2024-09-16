const express = require("express")
const { testController } = require("../Contorllers/test.conroller")
const router = express.Router()

const testRoute = router.get('/', testController)

module.exports = {
    testRoute
}