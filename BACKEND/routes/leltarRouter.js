import { Router } from "express"
import pkg from 'jsonwebtoken';
const { sign } = pkg;
const router = Router()

import { Items } from "../models/ItemsModel.js"

import { authMiddle, checkPassword, checkRequiredFields, genPassword, sendEmail, firstLoginFalse } from "../services/auth/utilFunctions.utils.js"
import { updateUser, createUser } from "../services/auth/User.service.js"

import { getItems, createItem, updateItem, deleteItem } from "../services/storage/Item.service.js"
import { getItemNames, createItemName, updateItemName, deleteItemName } from "../services/storage/ItemName.service.js"
import { getPlaces, createPlace, deletePlace } from "../services/storage/Storage.service.js"
import { createLogs } from "../services/log/Logs.service.js"
import { getLogs, createExcel } from "../services/log/ExcelLog.service.js"




router.use((req, res, next) => {
    if (req.path === '/login' || req.path ==='/register' || req.path ==='/passwordChange') {
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
router.post("/storagePlace", 
    async function(req, res, next){
        try{
            const {storage} = req.body
            await checkRequiredFields(storage, res)
            res.json(await createPlace(storage))
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
            await checkRequiredFields(item, res)
            res.json(await createItemName(item))
        }
        catch(err){
            next(err)
        }
})



//item
router.post("/item", 

    async function(req, res, next){

        try{
            const httpMethod = req.method

            const createdBy = req.user.id

            const {itemNameId, storagePlaceId, quantity, description} = req.body

            if (!itemNameId || !storagePlaceId  || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            
            const item = await Items.findOne({ where: { itemNameId: itemNameId, storagePlaceId: storagePlaceId }});
            
            let previousQuantity
            if (item) {
                previousQuantity = item.quantity
            }
            
            let  quantityChange = `+${String(quantity)}`
            await createLogs(itemNameId, storagePlaceId, quantityChange, previousQuantity,  createdBy, httpMethod)
            res.json(await createItem(itemNameId, storagePlaceId, description,  quantity ))
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
            res.json(await updateItemName(id, item))
            
        }
        catch(err){
            next(err)
        }
})

router.put("/item",
    async function (req, res, next) {

        try{
            const createdBy = req.user.id
            const httpMethod = req.method
            
            const {storagePlaceId, itemNameId, newStoragePlaceId, description, quantity} = req.body
            
            const item = await Items.findOne({ where: { itemNameId: itemNameId, storagePlaceId: storagePlaceId }});
            
            let previousQuantityFrom
            if (item) {
                previousQuantityFrom = item.quantity
            }

            const newItem = await Items.findOne({ where: { itemNameId: itemNameId, storagePlaceId: newStoragePlaceId }});
            let previousQuantityTo
            if (newItem) {
                previousQuantityTo = newItem.quantity
            }
            
            let  quantityChangeFrom = `-${String(quantity)}`
            let  quantityChangeTo = `+${String(quantity)}`
            await createLogs(itemNameId, storagePlaceId,  quantityChangeFrom, previousQuantityFrom,  createdBy, httpMethod)
            await createLogs(itemNameId, newStoragePlaceId,  quantityChangeTo, previousQuantityTo,  createdBy, httpMethod)
            res.json(await updateItem(storagePlaceId, itemNameId, newStoragePlaceId, description, quantity))
        
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
            res.json(await deletePlace(id))
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
            res.json(await deleteItemName(id))
        }
        catch(err){
            next(err)
        }
})

//item
router.patch("/item",
    async function(req, res, next){
        try{
            const httpMethod = req.method
            const createdBy = req.user.id
            const {itemNameId, storagePlaceId, description, quantity} = req.body
            
            const item = await Items.findOne({where: {itemNameId: itemNameId, storagePlaceId: storagePlaceId}})
            let previousQuantity
            if (item) {
                previousQuantity = item.quantity
            }
            let quantityChange = `-${String(quantity)}`
            await createLogs(itemNameId, storagePlaceId,  quantityChange, previousQuantity,  createdBy, httpMethod)

            res.json(await deleteItem(itemNameId, storagePlaceId, description, quantity))
        
        }
        catch(err){
            next(err)
        }
})


//functions 
router.post('/login', async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        if (!userEmail || !userPassword) {
            return res.status(400).json({ message: "Missing name or password" });
        }
        
        const user = await checkPassword(userEmail, userPassword);
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
        
        //const userPassword = await genPassword() 
        const { userEmail, userPassword, isAdmin } = req.body;

        
        if (!userEmail || userEmail==""|| isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await createUser(userEmail, userPassword, isAdmin);
        //const email = await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(userPassword)}`, `Jelszó: ${String(userPassword)}`)
        return res.status(201).json({ message: `User created` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/firstLogin", 
    async function(req, res, next){
        try{
            const user = await firstLoginFalse(req)
            const {userPassword} = req.body
            res.json(await updateUser(user.userEmail, userPassword))
        }
        catch(err){
            next(err)
        }
})

router.put("/passwordChange",
    async function(req, res, next){
        try{
        
        const {userEmail} = req.body

        const newPassword = await genPassword() 
        await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(newPassword)}`, `Jelszó: ${String(newPassword)}`)
        res.json(await updateUser(userEmail, newPassword))
        
    }
    catch(err){
        next(err)
    }
}
)

router.post('/log', async (req, res) => {
    try {
        const data = await getLogs(req); 
        const excelBuffer = await createExcel(data);

        res.setHeader('Content-Disposition', 'attachment; filename="logs.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(Buffer.from(excelBuffer));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating Excel file");
    }
});
export default router