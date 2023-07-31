const { nanoid } = require("nanoid")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://database-user-1:databaseofzubayer@cluster0.1f3iy.mongodb.net/chat-app?retryWrites=true&w=majority")
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const { Server } = require("socket.io")
const { createServer } = require("http")
const httpServer = createServer(app)
require("dotenv").config()

// firebase cloude messaging
const firebase = require("firebase-admin");

const serviceAccount = require('./firebase-private-key.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});



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

    socket.on("new_active_user", (data) => {
        global.activeUsers.set(data.userEmail, data.socketID)
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    socket.on("disconnect", () => {
        activeUsers.forEach((value, key) => {
            if (value == socket.id) {
                io.emit("typingStopped", { typingUser: { email: key } })
                activeUsers.delete(key)
            }
        })
        global.activeUsersEmail = [...activeUsers.keys()]
        console.log("disconnect")
        // console.log(activeUsersEmail)
        io.emit("active_status_updated", activeUsersEmail)
    })
    socket.on("new_message", (data) => {
        if (data.conversationID) {
            io.to(activeUsers.get(data.receiver.email)).emit("new_message", data)
        }
    })

    socket.on("new_conversation", (data) => {
        console.log("hi")
        io.to(activeUsers.get(data.lastMessage?.receiver.email)).emit("new_conversation", data)
    })

    socket.on("new_last_message", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("new_last_message", data)
    })

    socket.on("typing", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typing", { typingUser: data.typingUser })
    })
    socket.on("typingStopped", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typingStopped", { typingUser: data.typingUser })
    })
})

// socket

const { signupRoute } = require("./Routes/sinup.route")
const { loginUserRouter } = require("./Routes/login.route")
const { allUsersRoute } = require("./Routes/allUsers.route")
const { sendTextRoute } = require("./Routes/sendText.route")
const { getTextsRoute } = require("./Routes/getTexts.route")
const { updateUnreadRoute } = require("./Routes/updateUnread.route")
const { addConversationRoute } = require("./Routes/addConversation")
const { notificationTokenRoute } = require("./Routes/updateNotificationToken.route")

app.use('/signup', signupRoute)
app.use('/login', loginUserRouter)
app.use('/all-users', allUsersRoute)
app.use('/send-text', sendTextRoute)
app.use('/get-texts', getTextsRoute)
app.use('/update-unread', updateUnreadRoute)
app.use('/add-conversation', addConversationRoute)
app.use('/update-notification-token', notificationTokenRoute)

app.post('/send-height', (req, res) => {
    console.log(req.body)
})

app.get('/', (req, res) => {
    const x = nanoid(30)
    res.send("server is working fine!!!")
})
httpServer.listen(5000, () => console.log("server working!!!"))