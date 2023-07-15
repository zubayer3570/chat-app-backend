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

    socket.on("new_active_user", (data) => {
        global.activeUsers.set(data.userEmail, data.socketID)
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    socket.on("disconnect", () => {
        activeUsers.forEach((value, key) => {
            if (value == socket.id) {
                activeUsers.delete(key)
            }
        })
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })
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