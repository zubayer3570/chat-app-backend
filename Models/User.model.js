const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    profileImg: String,
    name: String,
    password: String,
    email: String,
    keys: Array,
    preKeys: Array
}, { timestamps: true })

const User = mongoose.model("user", UserSchema)
module.exports = User