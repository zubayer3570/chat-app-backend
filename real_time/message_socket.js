// new message
global.getSocket() && getSocket().on("new_message", (data) => {
    if (data.conversationId) {
        io.to(activeUsers.get(data.receiver.email)).emit("new_message", data)
    }
})