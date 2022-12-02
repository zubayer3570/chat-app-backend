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
    
    socket.on("add_active_user", (userId) => {
        const selected = activeUsers.find(activeUser=> userId == activeUser.userId)
        if(selected){
            selected.socketId = socket.id
        } else{
            activeUsers.push({
                userId,
                socketId: socket.id
            })
        }
    })
    socket.on("disconnect", ()=>{
        const filtered = activeUsers.filter(activeUser => activeUser.socketId != socket.id)
        activeUsers = filtered
    })
})
const { createUserRouter, getUsersRouter, getUserRouter } = require("./Routes/people.route")
const { getConversationRouter, checkConversationRouter } = require("./Routes/conversation.route")
const { sendMsgRouter, getMessagesRouter } = require("./Routes/messages.route")
const { loginUserRouter } = require("./Routes/login.router")

app.use('/create-user', createUserRouter)
app.use('/login', loginUserRouter)
app.use('/get-users', getUsersRouter)
app.use('/get-user', getUserRouter)
app.use('/get-conversations', getConversationRouter)
app.use('/check-conversation', checkConversationRouter)
app.use('/send-message', sendMsgRouter)
app.use('/get-messages', getMessagesRouter)


app.get('/', (req, res) => {
    res.send("server is working fine!!!")
})
httpServer.listen(5000, () => console.log("server working!!!"))