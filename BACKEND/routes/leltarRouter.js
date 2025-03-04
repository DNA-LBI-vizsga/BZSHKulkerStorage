import { Router } from "express"
import pkg from 'jsonwebtoken';
const { sign } = pkg;
const router = Router()

import { Items } from "../models/ItemsModel.js"

import { authMiddle, checkPassword, checkRequiredFields, genPassword, sendEmail, validateAdmin } from "../services/auth/authUtils.service.js"
import { updateUser, createUser } from "../services/auth/User.service.js"

import { getItems, createItem, updateItem, deleteItem } from "../services/storage/Item.service.js"
import { getItemNames, createItemName, updateItemName, deleteItemName } from "../services/storage/ItemName.service.js"
import { getPlaces, createPlace, deletePlace } from "../services/storage/Storage.service.js"

import { createActionType } from "../services/log/ActionType.service.js"
import { createLogs } from "../services/log/Logs.service.js"




router.use((req, res, next) => {
    if (req.path === '/login' || req.path ==='/register') {
        return next(); 
    }
    return authMiddle(req, res, next);
});

router.post("/mail",
    async function (req, res, next) {
        const {to, subject, text, html} = req.body
        try{
            await sendEmail(to, subject, text, html);
        res.status(200).json({ message: 'Email sent successfully' });
        }catch(err){
            next(err)
        }
    }
)


//GET endpoints
//storage_place
router.get("/storagePlace", 
    async function(req, res, next){
        
        
        try{
            res.json(await getPlaces())
        }
        catch(err){
            next(err)
        }
})

/
//item_name
router.get("/itemName", 
    async function(req, res, next){
        try{
            res.json(await getItemNames())
        }
        catch(err){
            next(err)
        }
})

router.get("/item", 
    async function(req, res, next){
        try{
            res.json(await getItems())
        }
        catch(err){
            next(err)
        }
})



//CREATE endpoints
//storage_place
router.post("/storagePlace", validateAdmin,
    async function(req, res, next){
        try{
            const {storage} = req.body
            checkRequiredFields(storage, res)
            res.json(await createPlace(storage))
        }
        catch(err){
            next(err)
        }
})
//item_name
router.post("/itemName", validateAdmin, 
    async function(req, res, next){

        try{
            const {item} = req.body
            checkRequiredFields(item, res)
            res.json(await createItemName(item))
        }
        catch(err){
            next(err)
        }
})



//item
router.post("/item/:quantity", 

    async function(req, res, next){

        try{
            const httpMethod = req.method

            const createdBy = req.user.id

            const {quantity} = req.params
            const {itemNameId, storagePlaceId, description} = req.body

            if (!itemNameId || !storagePlaceId || !createdBy || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            res.json(await createItem(itemNameId, storagePlaceId, createdBy, description, quantity))
            const item = await Items.findOne({ order: [['id', 'DESC']]})


            createLogs(item.id, createdBy, httpMethod)
        }
        catch(err){
            next(err)
        }
})

//actiontype
router.post("/action", validateAdmin,
    async function(req, res, next){
        try{
            const {actionType} = req.body
            res.json(await createActionType(actionType))
        }
        catch(err){
            next(err)
        }
})

//UPDATE endpoints
//item_name
router.put("/itemName/:id", validateAdmin,
    async function(req, res, next){

        try{

            const {id} = req.params
            const {item} = req.body
            res.json(await updateItemName(id, item))
            
        }
        catch(err){
            next(err)
        }
})

router.put("/item/:id", validateAdmin,
    async function (req, res, next) {

        try{
            const createdBy = req.user.id
            const httpMethod = req.method
            const {id} = req.params
            
            const {storagePlaceId, itemNameId, description} = req.body
            res.json(await updateItem(id, createdBy, storagePlaceId, itemNameId, description))

            const item = await Items.findOne({ order: [['id', 'DESC']]})
            createLogs(item.id, createdBy, httpMethod)
            
        }
        catch(err){
            next(err)
        }
    })

router.put("/passwordChange",
    async function(req, res, next){
        try{
        
        const {userEmail, newPassword} = req.body
        console.log(userEmail, newPassword)
        res.json(await updateUser(userEmail, newPassword))
        
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
        try{
            const {id} = req.params
            res.json(await deletePlace(id))
        }
        catch(err){
            next(err)
        }
})
//item_name
router.delete("/itemName/:id", validateAdmin,
    async function(req, res, next){

        try{

            const {id} = req.params
            res.json(await deleteItemName(id))
        }
        catch(err){
            next(err)
        }
})

//item
router.patch("/item/:id", validateAdmin,
    async function(req, res, next){
        try{
            const httpMethod = req.method
            const createdBy = req.user.id
            const {id} = req.params
            res.json(await deleteItem(id))

            const item = await Items.findOne({ order: [['id', 'DESC']]})
            createLogs(item.id, createdBy, httpMethod)
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
        
        const user = await checkPassword(userName, userPassword);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }else{
            const token = sign({ id: user.id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "4h" });

            return res.status(200).json({token, message: "Login successful" });
        }
    
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/register',  async (req, res) => {
        
    
    
    try {
        
        const userPassword = await genPassword() 
        const { userEmail,  isAdmin } = req.body;

        
        if (!userEmail || userEmail==""|| isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await createUser(userEmail, userPassword, isAdmin);
        const email = await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(userPassword)}`, `Jelszó: ${String(userPassword)}`)
        return res.status(201).json({ message: `User created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router