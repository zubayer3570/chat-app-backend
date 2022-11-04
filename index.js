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
// setting io and socket as a global variable
let activeUsers = []
global.io = io
io.on("connection", (socket) => {
    global.socket = socket
    global.activeUsers = activeUsers
    
    socket.on("add_active_user", (data) => {
        global.userId = data
        const selected = activeUsers.find(activeUser=> data == activeUser.userId)
        if(selected){
            selected.socketId = socket.id
        } else{
            activeUsers.push({
                userId: data,
                socketId: socket.id
            })
        }
    })
})
const { createUserRouter, getUsersRouter } = require("./Routes/people.route")
const { createConversationRouter, getConversationRouter } = require("./Routes/conversation.route")

app.use('/create-user', createUserRouter)
app.use('/get-users', createUserRouter)
app.use('/create-conversation', createConversationRouter)
app.use('/get-converstaions', getConversationRouter)


app.get('/', (req, res) => {
    res.send("server is working fine!!!")
})
httpServer.listen(5000, () => console.log("server working!!!"))