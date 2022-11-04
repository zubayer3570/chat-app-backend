const People = require("../Models/People.model")

const createUser = async (req, res) => {
    try {
        const userData = req.body
        const newUser = new People(userData)
        const response = await newUser.save()
        await io.emit("new_user", response)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
}
const getUsers = async (req, res) => {
    try {
        const result = await People.find({})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    createUser,
    getUsers
}