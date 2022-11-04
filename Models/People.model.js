const mongoose = require("mongoose")
const PeopleSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })
const People = mongoose.model("people", PeopleSchema)
module.exports = People