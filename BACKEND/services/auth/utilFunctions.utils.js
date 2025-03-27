import { User } from "../../models/UserModel.js";

import { compare } from "bcrypt";
import gkp from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto'
import sgMail from '@sendgrid/mail';

dotenv.config();

const { verify } = gkp;


//Mailing, setup and sending
const mailing = {
    apiKey: process.env.SENDGRID_API_KEY
};
sgMail.setApiKey(mailing.apiKey)

async function sendEmail(to, subject, text, html) {
    const msg = {
        to,
        from: 'levaibalazsistvan@ktch.hu',
        subject,
        text,
        html
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


//Password checking
async function checkPassword(userEmail, password){
    try {
        const user = await User.findOne({where:{userEmail:userEmail}})
        
        if(!user){return null}
        
        const isMatch = await compare(password, user.userPassword);
        
        if(!isMatch){return null}
        
        return user
    } catch (error) {
        console.error('Error checking password:', error);  
        return null
    }
}


//Token checker
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


//Token validation
async function validateToken(token) {
    if (token.split('.').length !== 3) {
        throw new Error('Invalid token format');
    }

    try {
        return verify(token, process.env.SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid token: ' + err.message);
    }
}


//Admin validation
async function validateAdmin(req, res, next) {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


//Authentication middleware
async function authMiddle(req, res, next) {
    const authHead = req.headers['authorization'];
    const payload = await tokenChecker(authHead, res);

    if (!payload) {
        return res.status(401).json({ message: "Auth header missing or invalid" });
    }

    req.user = payload; 
    next();
}


//Required field checker - only for ItemName and StoragePlace
async function checkRequiredFields(requiredField, res) {
    if (!requiredField || requiredField == "") {
        return res.status(400).json({ message: `Missing ${requiredField} field` });
    }
}


//Password generator for user registration
async function genPassword(length) {
    try {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~";
    
    const allChars = upperCase + lowerCase + numbers + specialChars;
    
    let password = "";
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split("").sort(() => 0.5 - Math.random()).join(""); 
    } catch (error) {
        console.error('Error generating password:', error);
    }
}

//First login checker for password change
async function firstLoginFalse(req) {
    const user = await User.findOne({where:{
        id: req.user.id,
    }})
    
    user.set({isFirstLogin: false})
    user.save()
    return user
}

//Validation for password change
async function validatePassword(password) {
    try {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/]/.test(password);
        const minLength = password.length >= 8; // Adjust minimum length if needed

        if (!hasUpperCase) throw new Error("Password must contain at least one uppercase letter.");
        if (!hasLowerCase) throw new Error("Password must contain at least one lowercase letter.");
        if (!hasNumber) throw new Error("Password must contain at least one number.");
        if (!hasSpecialChar) throw new Error("Password must contain at least one special character.");
        if (!minLength) throw new Error("Password must be at least 8 characters long.");

        return true; // If all conditions pass, return true
    } catch (error) {
        throw new Error(`Password validation failed: ${error.message}`);
    }
}

export{    
    checkPassword,
    validateAdmin,
    checkRequiredFields,
    authMiddle,
    sendEmail,
    genPassword,
    firstLoginFalse,
    validatePassword
}