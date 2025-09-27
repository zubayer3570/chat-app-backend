const { Server } = require("socket.io")

let io = null

var active_emails = []

// socket.io server instance
const createSocketServer = (httpServer) => {
    try {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        })
        // console.log(io)

        io.on("connection", (socket) => {
            const userEmail = socket.handshake.query.email
            socket.join(userEmail)
            active_emails.push[userEmail]
        })

    } catch (err) {
        console.log(err)
    }
}

const getIO = () => {
    return io
}

const getActiveEmails = () => {
    return active_emails
}

module.exports = {
    getIO,
    createSocketServer,
    getActiveEmails
}