const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    _id: String,
    profileImg: String,
    name: String,
    password: String,
    email: String,
    conversationIDs: Array
}, { timestamps: true })
const User = mongoose.model("people", UserSchema)
module.exports = User