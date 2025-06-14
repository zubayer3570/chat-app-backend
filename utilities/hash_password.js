const bcrypt = require("bcrypt")

const hash_password = async (password) =>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

const compare_password = async (password, enc_password) =>{
    return await bcrypt.compare(password, enc_password)
}

const test = async () => {
    console.log(await compare_password("11111111", "$2a$10$Yo5cL/.b7LjVLY8ZqrPuceeQtjNYNYeoReMr647NGDf/qfKT9C1ke"))
}

test()

module.exports = {
    hash_password,
    compare_password
}