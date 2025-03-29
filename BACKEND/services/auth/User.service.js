import { User } from "../../models/UserModel.js"
import { hash } from "bcrypt"


//User getter
async function getUser(){
    try {
        const users = await User.findAll()
        let user = users.map(user => ({
            id: user.id,
            userEmail: user.userEmail,
            isAdmin: user.isAdmin,
            isDisabled: user.isDisabled
        }))
        return user
    } catch (err) {
        throw new Error('Failed to fetch user' + err);
    }
}


//User creation
async function createUser(userEmail, password, isAdmin){
    
    
    const userPassword = password;
    try{
        const numSalts = 10
        const hashedPassword = await hash(String(userPassword), numSalts) 
        const user = await User.create(
            { userEmail: userEmail, userPassword: hashedPassword, isAdmin: isAdmin }

        )
        
        return {message: `User created successfully` } 
    }
    catch(err){
        throw new Error('Failed to create user' + err); 
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
        throw new Error('Error changing password' + err); 
    }
}

async function deleteAdminRole(userEmail){

    try{
        const user = await User.findOne({where:{userEmail: userEmail}})

        if (!user) {
            throw new Error(`User not found`);
        }

        user.set({isAdmin: false})
        await user.save()

        return {message: "User demoted from admin role"}
    }catch(err){
        throw new Error ("Error demoting user" + err)
    }
}

async function addAdminRole(userEmail){

    try{
        const user = await User.findOne({where:{userEmail: userEmail}})

        if (!user) {
            throw new Error(`User not found`);
        }

        user.set({isAdmin: true})
        await user.save()

        return {message: "User promoted to admin role"}
    }catch(err){
        throw new Error ("Error promoting user" + err)
    }
}

async function disableUser(userEmail){

    try{
        const user = await User.findOne({where:{userEmail: userEmail}})

        if (!user) {
            throw new Error(`User not found`);
        }

        user.set({isDisabled: true, isAdmin: false})
        await user.save()

        return {message: "User disabled"}
    }catch(err){
        throw new Error('Error disabling user' + err);
    }
}

async function enableUser(userEmail){

    try{
        const user = await User.findOne({where:{userEmail: userEmail}})

        if (!user) {
            throw new Error(`User not found`);
        }

        user.set({isDisabled: false})
        await user.save()

        return {message: "User enabled"}
    }catch(err){
        throw new Error('Error enabling user' + err);
    }
}


export{
    getUser,
    createUser,
    updateUser,
    deleteAdminRole,
    addAdminRole,
    disableUser,
    enableUser
}