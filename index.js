const mongoose = require("mongoose")
const {default: axios}  = require("axios")
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
    socket.on("new_opened_conversation", (data) => {
        activeUsers.forEach(activeUser => {
            if (activeUser.userID == data.userID) {
                activeUser.openedConversationID = data.openedConversationID
            }
        })
    })
    socket.on('disconnect', async () => {
        // deleting the conversations, which has no messages
        const conversations = await Conversation.find({})
        const messsageDoseNotExists = await Promise.all(conversations.map(async conversation => {
            const found = await Message.findOne({ conversationID: conversation._id })
            if (!found) {
                return conversation._id;
            }
        }))
        await Conversation.deleteMany({ _id: { $in: messsageDoseNotExists } })

        // removing the user from activeUsers array of the server
        activeUsers.forEach(activeUser => {
            if (activeUser.socketID == socket.id) {
                activeUsers.splice(activeUsers.indexOf(activeUser), 1)
            }
        })
    })

    socket.on('new_message', async (message) => {
        console.log("inside new message")
        await axios.post('https://mailing-service.onrender.com/sendmail', { text: "inside new message" })
        activeUsers.forEach(activeUser => {
            if (message.receiver._id == activeUser.userID) {
                console.log("User id matched")
                axios.post('https://mailing-service.onrender.com/sendmail', { text: "User id matched" })
                if (activeUser.openedConversationID == message.conversationID) {
                    console.log("conversation id matched")
                    axios.post('https://mailing-service.onrender.com/sendmail', { text: "conversation id matched" })
                    console.log("------------------------")
                    io.to(activeUser.socketID).emit("new_message", message)
                } else {
                    console.log(activeUsers)
                }
            }
        })
    })


    global.io = io
    global.socket = socket
    global.activeUsers = activeUsers
})

const { createUserRouter, getUsersRouter, getUserRouter } = require("./Routes/people.route")
const { getConversationRouter, getConversationsRouter, checkConversationRouter } = require("./Routes/conversation.route")
const { sendMsgRouter, getMessagesRouter } = require("./Routes/messages.route")
const { loginUserRouter } = require("./Routes/login.router")
const Conversation = require("./Models/Conversation.model")
const Message = require("./Models/Msg.model")

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