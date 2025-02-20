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
    if(token.split('.').length !=3){
        throw new Error('Invalid token')
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.split('-').join('+').split('_').join('/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));



    jwt.verify(token, process.env.SECRET_KEY, (err) =>{
            if(err){
                throw new Error('Invalid token signature');
            }
        }
    )

    const expDate = payload.exp

    if (Date.now()>=expDate*1000){
        throw new Error('Token has expired');
    }
    
    
    
}
    











module.exports = {    
    checkPassword,
    validateToken,
    validateAdmin
}