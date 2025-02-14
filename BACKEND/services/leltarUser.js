const {User} = require("../models/UserModel")
const bcrypt = require("bcrypt")

async function getUser(){
    try {
        const user = await User.findOne()
        return user
    } catch (error) {
        return null
    }
}

async function createUser(name, password, isAdmin){
    const admin = User.findOne({where})
    
    const userPassword = password || 'leltarjelszo';
    try{
        const numSalts = 10
        const hashedPassword = await bcrypt.hash(userPassword, numSalts) 
        const user = await User.create(
            { name: name, user_password: hashedPassword, isAdmin: isAdmin }

        )
        
        return {message: "User created successfully"}
    }
    catch(err){
        return {message: err.message + "Failed to create user"}
    }
}

module.exports = {
    getUser,
    createUser
}