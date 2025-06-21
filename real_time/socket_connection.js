const { Server } = require("socket.io")
const { httpServer } = require("..")

// socket.io server instance
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const getIO = () => {
    return io
}

module.exports = {
    getIO
}