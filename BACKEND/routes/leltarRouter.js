const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()


const functions = require("../services/leltarFunctions")
const items = require("../services/leltarItem")
const name = require("../services/leltarName")
const storage_place = require("../services/leltarStorage")
const users = require("../services/leltarUser")
const value = require("../services/leltarValue")

//GET endpoints
//storage_place
router.get("/storagePlace", 
    async function(req, res, next){
        try{
            res.json(await storage_place.getPlaces())
        }
        catch(err){
            next(err)
        }
})

//value
router.get("/values", 
    async function(req, res, next){
        try{
            res.json(await value.getValues())
        }
        catch(err){
            next(err)
        }
})

//item_name
router.get("/itemName", 
    async function(req, res, next){
        try{
            res.json(await name.getItemNames())
        }
        catch(err){
            next(err)
        }
})

//CREATE endpoints
//storage_place
router.post("/storagePlace",
    async function(req, res, next){
        try{
            const {storage} = req.body
            if (!storage) {
                return res.status(400).json({ message: 'Missing storage field' });
            }
            res.json(await storage_place.createPlace(storage))
        }
        catch(err){
            next(err)
        }
})
//item_name
router.post("/itemName", 
    async function(req, res, next){
        try{
            const {item} = req.body
            if (!item) {
                return res.status(400).json({ message: 'Missing item field' });
            }
            res.json(await name.createItemName(item))
        }
        catch(err){
            next(err)
        }
})

//item
router.post("/item/:quantity", 
    async function(req, res, next){
        try{
            const {quantity} = req.params
            const {item_name_id, value_id, storage_place_id, user_id, description} = req.body
            if (!item_name_id || !value_id || !storage_place_id || !user_id || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            res.json(await items.createItem(item_name_id, value_id, storage_place_id, user_id, description, quantity))
            
        }
        catch(err){
            next(err)
        }
})

//UPDATE endpoints
//item_name
router.put("/itemName/:id",
    async function(req, res, next){
        try{
            const {id} = req.params
            const {item} = req.body
            res.json(await name.updateItemName(id, item))
            
        }
        catch(err){
            next(err)
        }
})



//DELETE endpoints
//storage_place
router.delete("/storagePlace/:id",
    async function(req, res, next){
        try{
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
        try{
            const {id} = req.params
            res.json(await name.deleteItemName(id))
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

router.post('/register', async (req, res) => {
    try {
        const { name, user_password, isAdmin } = req.body;
        if (!name || name=="" || !isAdmin) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await users.createUser(name, user_password, isAdmin);
        return res.status(201).json({ message: "User created" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router