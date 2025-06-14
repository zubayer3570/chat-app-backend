const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    profileImg: String,
    name: String,
    password: String,
    email: String,
}, { timestamps: true })

const User = mongoose.model("user", UserSchema)
module.exports = User