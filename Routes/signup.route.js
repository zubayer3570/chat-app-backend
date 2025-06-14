const { signupController } = require("../Contorllers/user.controller")
const fs = require("fs")

// **********image upload*****************
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "upload/"
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath)
        }
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname)
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now()
        cb(null, fileName + fileExt)
    }
})
const upload = multer({ storage })
// ***************************************

const router = require("express").Router()
const signupRoute = router.post('/', upload.single("profileImg"), signupController)
module.exports = { signupRoute };