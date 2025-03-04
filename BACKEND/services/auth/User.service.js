import { User } from "../../models/UserModel.js"
import { hash } from "bcrypt"


async function getUser(){
    try {
        const user = await User.findOne()
        return user
    } catch (error) {
        return null
    }
}

async function createUser(email, password, isAdmin){
    
    
    const userPassword = password;
    try{
        const numSalts = 10
        const hashedPassword = await hash(String(userPassword), numSalts) 
        const user = await User.create(
            { userEmail: email, userPassword: hashedPassword, isAdmin: isAdmin }

        )
        
        return {message: `User created successfully` }
    }
    catch(err){
        console.error(err);
        throw new Error('Failed to create user'); 
    }
}


async function updateUser(userEmail, newPassword) {


    try{
        const user = await User.findOne({where:{userEmail: userEmail}})
        console.log(user)

        if (!user) {
            throw new Error(`User not found`);
        }

        const numSalts = 10
        const hashedPassword = await hash(newPassword, numSalts) 

        console.log(hashedPassword, newPassword)

        user.set({
            userEmail: user.userEmail,
            userPassword: hashedPassword,
            isAdmin: user.isAdmin,
            isFirstLogin: false
        })  

        await user.save()

        return {message: "Password changed"}
    }catch(err){
        throw new Error('Error changing password'); 
    }
}

export{
    getUser,
    createUser,
    updateUser
}