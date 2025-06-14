const jwt = require("jsonwebtoken")

const jwt_verification = (req, res, next) => {
    const authorization = req.headers["authorization"]
    const token = authorization && authorization.split(" ")[1]
    if (!token){
        res.send({message: "No authorization token!"})
    }
    try {
        user = jwt.verify(token, "publickey")
        req.user = user
        next()
    } catch (err) {
        res.status(403).json({message: "Invalid or expired token"})
    }
}


module.exports = {
    jwt_verification,
}