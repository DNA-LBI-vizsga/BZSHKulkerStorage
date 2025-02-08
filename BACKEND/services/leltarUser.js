const {User} = require("../models/UserModel")

async function getUser(){
    try {
        const user = await User.findOne()
        return user
    } catch (error) {
        return null
    }
}

async function createUser(name, password){
    
}

module.exports = {
    getUser
}