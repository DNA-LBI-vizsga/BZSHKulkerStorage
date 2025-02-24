const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");
require('dotenv').config(); 




async function checkPassword(name, password){
    try {
        const user = await User.findOne({where:{name}})
        
        if(!user){return null}
        
        const isMatch = await bcrypt.compare(password, user.user_password);
        
        if(!isMatch){return null}
        
        return user
    } catch (error) {
        console.error('Error checking password:', error);  
        return null
    }
}

async function validateToken(token) {
    if (token.split('.').length !== 3) {
        throw new Error('Invalid token format');
    }

    try {
        
        jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid token: ' + err.message);
    }
    
    
    
}

async function validateAdmin(token){
    const payload = jwt.verify(token, process.env.SECRET_KEY)


    const user = await User.findOne({where: { id: payload.id} }) 

    if(user.isAdmin!=true){
        console.log(user.isAdmin)
        throw new Error("Access denied");
    }
}
    











module.exports = {    
    checkPassword,
    validateToken,
    validateAdmin
}