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



const { signupRoute } = require("./Routes/signup.route")
const { loginUserRouter } = require("./Routes/login.route")
const { refreshTokenRoute } = require("./Routes/refreshToken.route")
const { allUsersRoute } = require("./Routes/allUsers.route")
const { sendTextRoute } = require("./Routes/sendText.route")
const { getTextsRoute } = require("./Routes/getTexts.route")
const { updateUnreadRoute } = require("./Routes/updateUnread.route")
const { notificationTokenRoute } = require("./Routes/updateNotificationToken.route")
const { getConversationsRoute } = require("./Routes/getConversations.route")

app.use('/signup', signupRoute)
app.use('/login', loginUserRouter)
app.use("/refresh", refreshTokenRoute)
app.use('/all-users', allUsersRoute)
app.use('/send-text', sendTextRoute)
app.use('/get-texts', getTextsRoute)
app.use('/update-unread', updateUnreadRoute)
app.use('/get-conversations', getConversationsRoute)
app.use('/update-notification-token', notificationTokenRoute)

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

module.exports = {
    httpServer
}