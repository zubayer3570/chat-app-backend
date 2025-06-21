const User = require("../Models/User.model")
const IpModel = require("../Models/IP.model")
const cloudinary = require("cloudinary").v2
const { hash_password, compare_password } = require("../utilities/hash_password")
const { create_access_token, create_refresh_token } = require("../utilities/create_tokens")
const jwt = require("jsonwebtoken")

cloudinary.config({
    cloud_name: "da6qlanq1",
    api_key: "855239541721646",
    api_secret: "47BYqZca9ceCBRUwmZ1MjQlO_0o"
})

const signupController = async (req, res) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload("upload/" + req.file.filename, { resource_type: "image", use_filename: true })
        const userData = { ...req.body, password: await hash_password(req.body.password), profileImg: cloudinaryResponse.secure_url }

        const newUser = new User(userData)
        const user = await newUser.save()

        const access_token = create_access_token({ user: { ...user._doc, _id: user._doc._id.toString() } })
        const refresh_token = create_refresh_token({ user: { ...user._doc, _id: user._doc._id.toString() } })

        res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/refresh",
            maxage: 7 * 24 * 60 * 60 * 1000
        })

        // socket-io part
        await io.emit("new_user", user)

        res.json({ accessToken: access_token })
    } catch (error) {
        // // console.log(error)
        res.send(error)
    }
}

const loginUser = async (req, res) => {
    const newUserIP = new IpModel({ ip: req.socket.remoteAddress })
    await newUserIP.save()
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user && await compare_password(password, user.password) == true) {

            const access_token = create_access_token({ user: { ...user._doc, _id: user._doc._id.toString() } })
            const refresh_token = create_refresh_token({ user: { ...user._doc, _id: user._doc._id.toString() } })

            res.cookie("refreshToken", refresh_token, {
                httpOnly: true,
                secure: false,
                // sameSite: "strict",
                path: "/refresh",
                maxage: 7 * 24 * 60 * 60 * 1000
            })

            res.json({ accessToken: access_token })
        } else {
            res.status(404).send({ message: "Email or Password is Incorrect!" })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const refresh = async (req, res) => {
    token = req.cookies.refreshToken

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const decoded = jwt.verify(token, "privatekey")
        const newAccessToken = create_access_token({ user: decoded.user })
        return res.send({ accessToken: newAccessToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const result = await User.find()

        // sending all user after updating their active status
        // const updated = result.map(user => {
        //     const userIsActive = activeUsers.get(user.email)
        //     if (userIsActive) {
        //         user.active = true
        //     }
        //     return user
        // })

        res.send({allUsers: result})
    } catch (error) {
        // console.log(error)
        res.send(error)
    }
}


const updateNotificationToken = async (req, res) => {
    try {
        const exists = await User.findOne({ email: req.body.email, notificationToken: req.body.token })
        // console.log(exists)
        if (!exists?._id) {
            await User.updateOne({ email: req.body.email }, { $push: { notificationToken: req.body.token } })
            res.send({ message: "token saved successfully!" })
        }
    } catch (err) {
        // console.log(err)
    }
}

module.exports = {
    signupController,
    getAllUsers,
    loginUser,
    updateNotificationToken,
    refresh
}






