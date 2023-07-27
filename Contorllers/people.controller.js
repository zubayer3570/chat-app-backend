const { nanoid } = require("nanoid")
const User = require("../Models/User.model")
const Conversation = require("../Models/Conversation.model")
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
    try {
        const { email, password } = req.body
        // console.log(email)
        const user = await User.findOne({ email })
        // console.log(user)
        if (user && user.password == password) {
            const conversations = await Conversation.find({ _id: user.conversationIDs }).sort({updatedAt: "-1"})
            res.send({ user, conversations })
            // res.send({ ...user._doc, conversations: populatedConversations })
        } else {
            res.send({ message: "Something went wrong!" })
        }
    } catch (error) {
        console.log("hi")
        res.send(error)
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
            // activeUsersEmail?.map(activeUserEmail => {
            //     if (activeUserEmail == user.email) {
            //         user.active = true
            //     }
            // })
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
    res.send({message: "token saved successfully!"})
}

module.exports = {
    signupController,
    getAllUsers,
    getUser,
    loginUser,
    updateNotificationToken
}