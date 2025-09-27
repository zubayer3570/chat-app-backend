const jwt = require("jsonwebtoken")

const jwt_verification = (req, res, next) => {
    // next()
    // console.log(req.headers)

    const authorization = req.headers["authorization"]
    const token = authorization && authorization.split(" ")[1]
    if (!token){
        return res.status(500).send({message: "No authorization token!"})
    }
    try {
        user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        return res.status(401).send({message: "Invalid Token!!!"})
    }
}


module.exports = {
    jwt_verification,
}