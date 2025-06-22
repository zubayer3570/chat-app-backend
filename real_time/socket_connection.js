const { Server } = require("socket.io")

let io = null

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
        })
    } catch (err) {
        console.log(err)
    }
}

const getIO = () => {
    return io
}

module.exports = {
    getIO,
    createSocketServer
}