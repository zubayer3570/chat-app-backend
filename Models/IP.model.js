const mongoose = require("mongoose")
const ipSchema = new mongoose.Schema({
    ip: String
}, { timestamps: true })
const IpModel = mongoose.model("ip", ipSchema)
module.exports = IpModel