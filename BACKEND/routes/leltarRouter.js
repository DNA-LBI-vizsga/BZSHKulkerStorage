const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()


const functions = require("../services/leltarFunctions")
const items = require("../services/leltarItem")
const name = require("../services/leltarName")
const storage_place = require("../services/leltarStorage")
const users = require("../services/leltarUser")
const values = require("../services/leltarValue")

//GET endpoints
//storage_place
router.get("/storagePlace", 
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            res.json(await storage_place.getPlaces())
        }
        catch(err){
            next(err)
        }
})

//value
router.get("/value", 
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            res.json(await values.getValues())
        }
        catch(err){
            next(err)
        }
})

//item_name
router.get("/itemName", 
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            res.json(await name.getItemNames())
        }
        catch(err){
            next(err)
        }
})

router.get("/item", 
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            res.json(await items.getItems())
        }
        catch(err){
            next(err)
        }
})



//CREATE endpoints
//storage_place
router.post("/storagePlace",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {storage} = req.body
            functions.checkRequiredFields(storage, res)
            res.json(await storage_place.createPlace(storage))
        }
        catch(err){
            next(err)
        }
})
//item_name
router.post("/itemName", 
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {item} = req.body
            functions.checkRequiredFields(item, res)
            res.json(await name.createItemName(item))
        }
        catch(err){
            next(err)
        }
})

//value
router.post("/value", 
    async function(req, res, next){
        // const authHead = req.headers['authorization'] 

        // const tokenError = await functions.tokenChecker(authHead, res)
        // if(tokenError) return
        
        // const token = authHead.split(' ')[1]
        try{
            // await functions.validateToken(token)
            // await functions.validateAdmin(token)
            const {value} = req.body
            functions.checkRequiredFields(value, res)
            res.json(await values.createValue(value))
        }
        catch(err){
            next(err)
        }
})

//item
router.post("/item/:quantity", 

    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)

            const payload = jwt.verify(token, process.env.SECRET_KEY)
            const user_id = payload.id
            
            const {quantity} = req.params
            const {item_name, value, storage_place, description} = req.body
            if (!item_name || !value || !storage_place || !user_id || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            res.json(await items.createItem(item_name, value, storage_place, user_id, description, quantity))
            
        }
        catch(err){
            next(err)
        }
})

//UPDATE endpoints
//item_name
router.put("/itemName/:id",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {id} = req.params
            const {item} = req.body
            res.json(await name.updateItemName(id, item))
            
        }
        catch(err){
            next(err)
        }
})

router.put("/item/:id",
    async function (req, res, next) {
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const payload = jwt.verify(token, process.env.SECRET_KEY)
            const update_id = payload.id

            const {id} = req.params
            
            const {value = null, storage_place = null, item_name  = null, description = null} = req.body
            res.json(await items.updateItem(id, update_id, value, storage_place, item_name, description))
            
        }
        catch(err){
            next(err)
        }
    })

router.put("/passwordChange",
    async function(req, res, next){
        try{
        
        const {name, newPassword} = req.body
        console.log(name, newPassword)
        res.json(await users.updateUser(name, newPassword))
        
    }
    catch(err){
        next(err)
    }
}
)



//DELETE endpoints
//storage_place
router.delete("/storagePlace/:id",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {id} = req.params
            res.json(await storage_place.deletePlace(id))
        }
        catch(err){
            next(err)
        }
})
//item_name
router.delete("/itemName/:id",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {id} = req.params
            res.json(await name.deleteItemName(id))
        }
        catch(err){
            next(err)
        }
})

//item
router.delete("/items/:id",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const {id} = req.params
            res.json(await items.deleteItem(id))
        }
        catch(err){
            next(err)
        }
})


//functions 
router.post('/login', async (req, res) => {
    try {
        const { name, user_password } = req.body;
        if (!name || !user_password) {
            return res.status(400).json({ message: "Missing name or password" });
        }
        
        const user = await functions.checkPassword(name, user_password);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }else{
            const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "4h" });

            return res.status(200).json({token, message: "Login successful" });
        }
    
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/register',  async (req, res) => {
        // const authHead = req.headers['authorization'] 

        // const tokenError = await functions.tokenChecker(authHead, res)
        // if(tokenError) return
        
        // const token = authHead.split(' ')[1]
    
    
    try {
        // await functions.validateToken(token)
        // await functions.validateAdmin(token)
        
        const { name, user_password, isAdmin } = req.body;

        
        if (!name || name=="" || isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await users.createUser(name, user_password, isAdmin);
        return res.status(201).json({ message: "User created" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router