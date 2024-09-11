const { nanoid } = require("nanoid")
const User = require("../Models/User.model")
const Conversation = require("../Models/Conversation.model")
const IpModel = require("../Models/IP.model")
const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: "da6qlanq1",
    api_key: "855239541721646",
    api_secret: "47BYqZca9ceCBRUwmZ1MjQlO_0o"
})

const signupController = async (req, res) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload("upload/" + req.file.filename, { resource_type: "image", use_filename: true })
        const _id = nanoid()
        const userData = { ...req.body, profileImg: cloudinaryResponse.secure_url, _id, conversationIDs: [] }
        const newUser = new User(userData)
        const user = await newUser.save()
        await io.emit("new_user", user)
        res.send({ user, conversations: [] })
    } catch (error) {
        res.send(error)
    }
}
const loginUser = async (req, res) => {
    const newUserIP = new IpModel({ ip: req.socket.remoteAddress })
    await newUserIP.save()
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user && user.password == password) {
            const conversations = await Conversation.find({ _id: user.conversationIDs }).sort({ updatedAt: "-1" })
            res.send({ user, conversations })
        } else {
            console.log("hello here!!!!!!!!!!!!1")
            res.status(404).send({ message: "Email or Password is Incorrect!" })
        }
    } catch (error) {
        console.log("hello here!!!!!!!!!!!!2")
        res.send({ message: error.message }, { status: 500 })
    }
}
const getAllUsers = async (req, res) => {
    try {
        const result = await User.find({}, "name email profileImg _id active conversationIDs notificationToken")

        // sending all user after updating their active status
        const updated = result.map(user => {
            const userIsActive = activeUsers.get(user.email)
            if (userIsActive) {
                user.active = true
            }
            return user
        })
        res.send(updated)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}
const getUser = async (req, res) => {
    const { userID } = req.params
    try {
        const user = await People.findOne({ _id: userID })
        res.send(user)
    } catch (error) {
        res.send(error)
    }
}

const updateNotificationToken = async (req, res) => {
    await User.updateOne({ email: req.body.email }, { $set: { notificationToken: req.body.token } })
    res.send({ message: "token saved successfully!" })
}

module.exports = {
    signupController,
    getAllUsers,
    getUser,
    loginUser,
    updateNotificationToken
}