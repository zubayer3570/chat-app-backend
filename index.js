require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.1f3iy.mongodb.net/chat-app`)
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())

app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { Server } = require("socket.io")
const { createServer } = require("http")
const httpServer = createServer(app)

// firebase cloude messaging
const firebase = require("firebase-admin");

const serviceAccount = require('./firebase-private-key.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});



const { signupRoute } = require("./Routes/signup.route")
const { loginUserRouter } = require("./Routes/login.route")
const { refreshTokenRoute } = require("./Routes/refreshToken.route")
const { allUsersRoute } = require("./Routes/allUsers.route")
const { sendTextRoute } = require("./Routes/sendText.route")
const { getTextsRoute } = require("./Routes/getTexts.route")
const { updateUnreadRoute } = require("./Routes/updateUnread.route")
const { notificationTokenRoute } = require("./Routes/updateNotificationToken.route")
const { getConversationsRoute } = require("./Routes/getConversations.route")
const { updateMessageRoute } = require("./Routes/updateMessage.route")
const { deleteTextRoute } = require("./Routes/deleteText.route")
const { createNewConversationRouter } = require("./Routes/createNewConversation.route")
const { createSocketServer } = require("./real_time/socket_connection")

app.use('/signup', signupRoute)
app.use('/login', loginUserRouter)
app.use("/refresh", refreshTokenRoute)
app.use('/all-users', allUsersRoute)
app.use('/send-text', sendTextRoute)
app.use('/get-texts', getTextsRoute)
app.use('/update-unread', updateUnreadRoute)
app.use('/get-conversations', getConversationsRoute)
app.use('/update-notification-token', notificationTokenRoute)
app.use('/delete-text', deleteTextRoute)
app.use('/update-text', updateMessageRoute)
app.use('/create-new-conversation', createNewConversationRouter)

createSocketServer(httpServer)

app.post('/send-height', (req, res) => {
    // console.log(req.body)
})

app.get('/', (req, res) => {
    res.send("server is working fine!!!")
})

httpServer.listen(
    5000, 
    () => {
        
        console.log("server working!!!")
    }
)

module.exports = {
    httpServer
}