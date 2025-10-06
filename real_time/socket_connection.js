const { Server } = require("socket.io")

let io = null

var active_emails = []

// socket.io server instance
const createSocketServer = (httpServer) => {
    try {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST", "PUT", "DELETE"]
            }
        })
        // console.log(io)

        io.on("connection", (socket) => {
            const userEmail = socket.handshake.query.email
            socket.join(userEmail)
            active_emails.push(userEmail)
            // console.log("io.sockets.adapter.rooms", io.sockets.adapter.rooms)

            socket.on("dh_public_key_sender", (payload) => {
                io.to([payload.to.email]).emit("dh_public_key_sender", payload)
            })
            socket.on("dh_public_key_receiver", (payload) => {
                console.log("dh_public_key_receiver", payload)
                io.to([payload.to.email]).emit("dh_public_key_receiver", payload)
            })
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