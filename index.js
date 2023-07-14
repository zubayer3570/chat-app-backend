const { nanoid } = require("nanoid")
const mongoose = require("mongoose")
const axios = require("axios")
mongoose.connect("mongodb+srv://database-user-1:databaseofzubayer@cluster0.1f3iy.mongodb.net/chat-app?retryWrites=true&w=majority")
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const { Server } = require("socket.io")
const { createServer } = require("http")
const httpServer = createServer(app)
// socket.io server instance
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})


global.activeUsers = new Map()
global.io = io
io.on("connection", (socket) => {
    global.socket = socket
    socket.on("new_user", (data) => {
        global.activeUsers.set(data.userEmail, data.socketID)
        // const tempActiveUsers = activeUsers.filter(user => user.userEmail != data.userEmail)
        // console.log([...tempActiveUsers, data])
        // global.activeUsers = [...tempActiveUsers, data]
    })
    // socket.on('new_active_user', (data) => {
    //     const userExists = activeUsers.find(activeUser => activeUser.socketID == data.socketID)
    //     if (userExists) {
    //         userExists.socketID = data.socketID
    //     } else {
    //         activeUsers.push(data)
    //     }
    // })
    // socket.on("new_opened_conversation", (data) => {
    //     activeUsers.forEach(activeUser => {
    //         if (activeUser.userID == data.userID) {
    //             activeUser.openedConversationID = data.openedConversationID
    //         }
    //     })
    // })
    // socket.on('disconnect', async () => {
    //     // deleting the conversations, which has no messages
    //     const conversations = await Conversation.find({})
    //     const messsageDoseNotExists = await Promise.all(conversations.map(async conversation => {
    //         const found = await Message.findOne({ conversationID: conversation._id })
    //         if (!found) {
    //             return conversation._id;
    //         }
    //     }))
    //     await Conversation.deleteMany({ _id: { $in: messsageDoseNotExists } })

    //     // removing the user from activeUsers array of the server
    //     activeUsers.forEach(activeUser => {
    //         if (activeUser.socketID == socket.id) {
    //             activeUsers.splice(activeUsers.indexOf(activeUser), 1)
    //         }
    //     })
    // })

    // socket.on('new_message', async (message) => {
    //     activeUsers.forEach(async activeUser => {
    //         if (activeUser.openedConversationID == message.conversationID) {
    //             io.to(activeUser.socketID).emit("new_message", message)
    //         } else {
    //             console.log(activeUsers)
    //         }
    //     })
    // })
})

const { signupRoute } = require("./Routes/sinup.route")
const { loginUserRouter } = require("./Routes/login.route")
const { allUsersRoute } = require("./Routes/allUsers.route")
const { sendTextRoute } = require("./Routes/sendText.route")
const { getTextsRoute } = require("./Routes/getTexts.route")
const { updateUnreadRoute } = require("./Routes/updateUnread.route")

app.use('/signup', signupRoute)
app.use('/login', loginUserRouter)
app.use('/all-users', allUsersRoute)
app.use('/send-text', sendTextRoute)
app.use('/get-texts', getTextsRoute)
app.use('/update-unread', updateUnreadRoute)


app.get('/', (req, res) => {
    const x = nanoid(30)
    res.send("server is working fine!!!")
})
httpServer.listen(5000, () => console.log("server working!!!"))