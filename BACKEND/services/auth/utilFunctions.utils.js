import { compare } from "bcrypt";
import gkp from 'jsonwebtoken';
const { verify } = gkp;
import { User } from "../../models/UserModel.js";
import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto'
import sgMail from '@sendgrid/mail';

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

async function genPassword(){
    const randomString = crypto.randomBytes(8).toString('hex'); 
    return randomString
}

async function isFirstLogin(req, res, next) {
    const user = await User.findOne({where:{
        id: req.user.id,
        isFirstLogin: true
    }})
    return user
}

export{    
    checkPassword,
    validateAdmin,
    checkRequiredFields,
    authMiddle,
    sendEmail,
    genPassword,
    isFirstLogin
}