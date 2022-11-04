const MsgModel = require("./Models/msgModel")

const sendMsg = async (req, res) => {
    try {
        const conversationID = req.params.id 
        const data = req.body
        const testMessage = new MsgModel(data)
        await testMessage.save()
        res.send("message saved successfully!!!")
    } catch (error) {
        res.send(error)
    }
}