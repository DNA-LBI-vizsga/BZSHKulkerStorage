const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");
const { Items } = require("../models/ItemsModel");
require('dotenv').config(); 




async function checkPassword(name, password){
    try {
        const user = await User.findOne({where:{userName:name}})
        
        if(!user){return null}
        
        const isMatch = await bcrypt.compare(password, user.userPassword);
        
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
        
        throw new Error("Access denied");
    }
}

async function tokenChecker(authHead, res) {
    if (!authHead) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHead.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing in authorization header" });
    }
    
    
    return false; 
}

async function checkRequiredFields(requiredField, res) {
    if (!requiredField || requiredField == "") {
        return res.status(400).json({ message: `Missing ${requiredField} field` });
    }
}



module.exports = {    
    checkPassword,
    validateToken,
    validateAdmin,
    tokenChecker,
    checkRequiredFields
}