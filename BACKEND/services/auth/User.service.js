import { User } from "../../models/UserModel.js"
import { hash } from "bcrypt"


//User getter
async function getUser(){
    try {
        const user = await User.findOne()
        return user
    } catch (error) {
        return null
    }
}


//User creation
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


//Password change for user
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
            isFirstLogin: true
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