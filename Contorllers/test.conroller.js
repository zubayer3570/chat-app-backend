const { ObjectId } = require("bson")

const testController = async (req, res) => {
    res.send({message: "hi"})
}

module.exports = {
    testController
}