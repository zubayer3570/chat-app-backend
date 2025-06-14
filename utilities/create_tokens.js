const jwt = require("jsonwebtoken")

const create_access_token = (data) => {
    try{
        token = jwt.sign({...data, _id: data._id.toString()}, "privatekey", {expiresIn: "1h"})
        return token
    } catch (err){
        console.log(err)
        return null
    }
}

const create_refresh_token = (data) => {
    try {
        token = jwt.sign({...data, _id: data._id.toString()}, "privatekey", {expiresIn: "7d"})
        return token
    } catch (err) {
        console.log(err)
        return null
    }
}

module.exports = {
    create_access_token,
    create_refresh_token
}