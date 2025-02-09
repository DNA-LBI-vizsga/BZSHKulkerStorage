const bcrypt = require("bcrypt");
const {User} = require("../models/UserModel");



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










module.exports = {    
    checkPassword
}