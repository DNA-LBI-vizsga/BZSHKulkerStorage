const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");
const { Items } = require("../models/ItemsModel");
const Sequelize = require('sequelize');
const { Op } = Sequelize
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
        
        throw new Error("Access denied");
    }
}


async function getLastNumber(item) {
    let lastNumber = 0

    if (item) {
        let codeParts = item.product_code.split('-');
        lastNumber = parseInt(codeParts[codeParts.length - 1]);
        
    } else {
        lastNumber = 0
    } 

    return lastNumber
}
    
async function latestItemQuery(currentId = null) {
    const latestItem = await Items.findOne({
        where: { 
            id: {
                [Op.ne]: currentId
            },
            product_code: {
                [Op.ne]: null
            }  
        },
        order: [['id', 'DESC']],
    });

    return latestItem
}


async function createCode(lastNumber, item, i) {
    const newNumber = String(lastNumber + i).padStart(4, '0');
    const item_code = `BZSH-${item}-${newNumber}`;
    return item_code
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
    getLastNumber, 
    latestItemQuery,
    createCode,
    tokenChecker,
    checkRequiredFields
}