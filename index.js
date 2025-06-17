const { nanoid } = require("nanoid")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://zubayer-mh:amizubayer01@cluster0.prufx.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0")
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())

app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

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

    // an user became active
    socket.on("new_active_user", (data) => {
        global.activeUsers.set(data.userEmail, data.socketID)
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    // user disconnected
    socket.on("disconnect", () => {
        activeUsers.forEach((value, key) => {
            if (value == socket.id) {
                io.emit("typingStopped", { typingUser: { email: key } })
                activeUsers.delete(key)
            }
        })
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    // new message
    socket.on("new_message", (data) => {
        if (data.conversationID) {
            io.to(activeUsers.get(data.receiver.email)).emit("new_message", data)
        }
    })

    // new conversation
    socket.on("new_conversation", (data) => {
        // console.log("server/recived/new-conv: ", data)
        io.to(activeUsers.get(data.lastMessage?.receiver?.email)).emit("new_conversation", data)
    })

    // last message updation
    socket.on("new_last_message", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("new_last_message", data)
    })

    // Typing
    socket.on("typing", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typing", { typingUser: data.typingUser })
    })

    // Typing stopped
    socket.on("typingStopped", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typingStopped", { typingUser: data.typingUser })
    })
})

// socket

const { signupRoute } = require("./Routes/signup.route")
const { loginUserRouter } = require("./Routes/login.route")
const { refreshTokenRoute } = require("./Routes/refreshToken.route")
const { allUsersRoute } = require("./Routes/allUsers.route")
const { sendTextRoute } = require("./Routes/sendText.route")
const { getTextsRoute } = require("./Routes/getTexts.route")
const { updateUnreadRoute } = require("./Routes/updateUnread.route")
const { addConversationRoute } = require("./Routes/addConversation")
const { notificationTokenRoute } = require("./Routes/updateNotificationToken.route")
const { testRoute } = require("./Routes/test.route")

app.use('/signup', signupRoute)
app.use('/login', loginUserRouter)
app.use("/refresh", refreshTokenRoute)
app.use('/all-users', allUsersRoute)
app.use('/send-text', sendTextRoute)
app.use('/get-texts', getTextsRoute)
app.use('/update-unread', updateUnreadRoute)
app.use('/add-conversation', addConversationRoute)
app.use('/update-notification-token', notificationTokenRoute)
app.use("/test", testRoute)

app.post('/send-height', (req, res) => {
    // console.log(req.body)
})

app.get('/', (req, res) => {
    const x = nanoid(30)
    res.send("server is working fine!!!")
})

httpServer.listen(
    5000, 
    () => console.log("server working!!!")
)