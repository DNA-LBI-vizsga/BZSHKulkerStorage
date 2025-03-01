const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()

const { Items } = require("../models/ItemsModel")


const functions = require("../services/leltarFunctions")
const items = require("../services/leltarItem")
const name = require("../services/leltarName")
const storage_place = require("../services/leltarStorage")
const users = require("../services/leltarUser")
const action = require("../services/leltarActionType")
const logs = require("../services/leltarLogs")
const { where } = require("sequelize")




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

/
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



//item
router.post("/item/:quantity", 

    async function(req, res, next){
        const authHead = req.headers['authorization'] 

        const tokenError = await functions.tokenChecker(authHead, res)
        if(tokenError) return
        
        const token = authHead.split(' ')[1]
        try{
            await functions.validateToken(token)
            const httpMethod = req.method

            const payload = jwt.verify(token, process.env.SECRET_KEY)
            const createdBy = payload.id

            const {quantity} = req.params
            const {itemNameId, storagePlaceId, description} = req.body

            if (!itemNameId || !storagePlaceId || !createdBy || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            res.json(await items.createItem(itemNameId, storagePlaceId, createdBy, description, quantity))
            const item = await Items.findOne({ order: [['id', 'DESC']]})


            logs.createLogs(item.id, createdBy, httpMethod)
        }
        catch(err){
            next(err)
        }
})

//actiontype
router.post("/action", 
    async function(req, res, next){
        try{
            const {actionType} = req.body
            res.json(await action.createActionType(actionType))
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
            const createdBy = payload.id
            const httpMethod = req.method
            const {id} = req.params
            
            const {storagePlaceId, itemNameId, description} = req.body
            res.json(await items.updateItem(id, createdBy, storagePlaceId, itemNameId, description))

            const item = await Items.findOne({ order: [['id', 'DESC']]})
            logs.createLogs(item.id, createdBy, httpMethod)
            
        }
        catch(err){
            next(err)
        }
    })

router.put("/passwordChange",
    async function(req, res, next){
        try{
        
        const {userName, newPassword} = req.body
        console.log(userName, newPassword)
        res.json(await users.updateUser(userName, newPassword))
        
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
router.patch("/item/:id",
    async function(req, res, next){
        const authHead = req.headers['authorization'] 
        
        
        const tokenError = await functions.tokenChecker(authHead, res)
        const token = authHead.split(' ')[1]
        if(tokenError) return
        
        try{
            await functions.validateToken(token)
            await functions.validateAdmin(token)
            const httpMethod = req.method
            const payload = jwt.verify(token, process.env.SECRET_KEY)
            const createdBy = payload.id
            const {id} = req.params
            res.json(await items.deleteItem(id))

            const item = await Items.findOne({ order: [['id', 'DESC']]})
            logs.createLogs(item.id, createdBy, httpMethod)
        }
        catch(err){
            next(err)
        }
})


//functions 
router.post('/login', async (req, res) => {
    try {
        const { userName, userPassword } = req.body;
        if (!userName || !userPassword) {
            return res.status(400).json({ message: "Missing name or password" });
        }
        
        const user = await functions.checkPassword(userName, userPassword);
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
        
        const { userName, userPassword, isAdmin } = req.body;
        console.log(userName)

        
        if (!userName || userName=="" || isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await users.createUser(userName, userPassword, isAdmin);
        return res.status(201).json({ message: `User created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router