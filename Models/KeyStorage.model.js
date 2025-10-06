const mongoose = require("mongoose")

const KeyStorageSchema = new mongoose.Schema({
    encryptedPrivateKey: String,
    conversationId: String,
    userId_1: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    userId_2: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
}, { timestamps: true })

const KeyStorage = mongoose.model("user", KeyStorageSchema)
module.exports = KeyStorage