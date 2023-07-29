const mongoose = require("mongoose")
const ipSchema = new mongoose.Schema({
    ip: String
}, { timestamps: true })
const IpModel = mongoose.model("people", ipSchema)
module.exports = IpModel