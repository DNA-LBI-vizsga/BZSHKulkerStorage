const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/UserModel");
require('dotenv').config(); 
const sgMail = require('@sendgrid/mail')

const mailing = {
    apiKey: process.env.SENDGRID_API_KEY
};


sgMail.setApiKey(mailing.apiKey)

async function sendEmail(to, subject, text, html) {
    const msg = {
        to: to,
        from: 'levaibalazsistvan@ktch.hu',
        subject: subject,
        text: text,
        html: html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


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


async function validateAdmin(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.user.userId } });

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


async function validateToken(token) {
    if (token.split('.').length !== 3) {
        throw new Error('Invalid token format');
    }

    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid token: ' + err.message);
    }
}

async function tokenChecker(authHead, res) {
    if (!authHead) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHead.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing in authorization header' });
    }

    try {
        const payload = await validateToken(token);
        return payload;
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

async function authMiddle(req, res, next) {
    const authHead = req.headers['authorization'];
    const payload = await tokenChecker(authHead, res);

    if (!payload) return;

    req.user = payload; 
    next();
}

async function checkRequiredFields(requiredField, res) {
    if (!requiredField || requiredField == "") {
        return res.status(400).json({ message: `Missing ${requiredField} field` });
    }
}


module.exports = {    
    checkPassword,
    validateAdmin,
    checkRequiredFields,
    authMiddle,
    sendEmail
}