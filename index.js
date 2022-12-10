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

// socket.io server instance
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})


let activeUsers = []
io.on("connection", (socket) => {
    socket.on('new_active_user', (data) => {
        const userExists = activeUsers.find(activeUser => activeUser.socketID == data.socketID)
        if (userExists) {
            userExists.socketID = data.socketID
        } else {
            activeUsers.push(data)
        }
    })
    socket.on('disconnect', () => {
        activeUsers.forEach(activeUser => {
            if (activeUser.socketID == socket.id) {
                activeUsers.splice(activeUsers.indexOf(activeUser), 1)
            }
        })
    })
    global.io = io
    global.socket = socket
    global.activeUsers = activeUsers
})

const { createUserRouter, getUsersRouter, getUserRouter } = require("./Routes/people.route")
const { getConversationRouter ,getConversationsRouter, checkConversationRouter } = require("./Routes/conversation.route")
const { sendMsgRouter, getMessagesRouter } = require("./Routes/messages.route")
const { loginUserRouter } = require("./Routes/login.router")

app.use('/create-user', createUserRouter)
app.use('/login', loginUserRouter)
app.use('/get-users', getUsersRouter)
app.use('/get-user', getUserRouter)
app.use('/get-conversations', getConversationsRouter)
app.use('/get-conversation', getConversationRouter)
app.use('/send-message', sendMsgRouter)
app.use('/get-messages', getMessagesRouter)


app.get('/', (req, res) => {
    res.send("server is working fine!!!")
})
httpServer.listen(5000, () => console.log("server working!!!"))