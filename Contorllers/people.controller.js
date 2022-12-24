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
        console.log(error)
    }
}
const loginUser = async (req, res)=>{
    try {
        const userData = req.body
        const user = await People.findOne(userData)
        res.send(user)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}
const getUsers = async (req, res) => {
    const userID = req.params.userID
    try {
        const result = await People.find({})
        result.forEach(user=>{
            if(user._id == userID){
                result.splice(result.indexOf(user), 1)
            }
        })
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}
const getUser = async (req, res) => {
    const {userID} = req.params
    try {
        const user = await People.findOne({_id: userID})
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    loginUser
}