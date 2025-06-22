// // socket.io server instance
// const io = new Server(httpServer, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// })

import { getIO } from "./socket_connection"


getIO().on("connection", (socket) => {
    const userEmail = socket.handshake.query.email
    socket.join(userEmail)

    // an user became active
    socket().on("new_active_user", (data) => {
        global.activeUsers.set(data.userEmail, data.socketID)
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    // user disconnected
    socket().on("disconnect", () => {
        activeUsers.forEach((value, key) => {
            if (value == socket().id) {
                io.emit("typingStopped", { typingUser: { email: key } })
                activeUsers.delete(key)
            }
        })
        global.activeUsersEmail = [...activeUsers.keys()]
        io.emit("active_status_updated", activeUsersEmail)
    })

    // // new message
    // socket().on("new_message", (data) => {
    //     if (data.conversationId) {
    //         io.to(data.receiver.email).emit("new_message", data)
    //     }
    // })

    // new conversation
    socket().on("new_conversation", (data) => {
        // console.log("server/recived/new-conv: ", data)
        io.to(activeUsers.get(data.lastMessage?.receiver?.email)).emit("new_conversation", data)
    })

    // last message updation
    socket().on("new_last_message", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("new_last_message", data)
    })

    // Typing
    socket().on("typing", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typing", { typingUser: data.typingUser })
    })

    // Typing stopped
    socket().on("typingStopped", (data) => {
        io.to(activeUsers.get(data.receiver.email)).emit("typingStopped", { typingUser: data.typingUser })
    })
})

// socket