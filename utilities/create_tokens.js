const jwt = require("jsonwebtoken")

const create_access_token = (data) => {
    try{
        token = jwt.sign(data, "privatekey", {expiresIn: "5s"})
        return token
    } catch (err){
        console.log("i am here", err)
        return null
    }
}

const create_refresh_token = (data) => {
    try {
        token = jwt.sign(data, "privatekey", {expiresIn: "7d"})
        return token
    } catch (err) {
        // console.log(err)
        return null
    }
}

module.exports = {
    create_access_token,
    create_refresh_token
}