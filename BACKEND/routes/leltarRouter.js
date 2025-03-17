import { Item } from "../models/ItemModel.js"

import { updateUser, createUser } from "../services/auth/User.service.js"
import { authMiddle, checkPassword, checkRequiredFields, genPassword, sendEmail, firstLoginFalse } from "../services/auth/utilFunctions.utils.js"

import { getLogs, createExcel } from "../services/log/ExcelLog.service.js"
import { createLogs } from "../services/log/Logs.service.js"

import { getItem, createItem, updateItem, deleteItem } from "../services/storage/Item.service.js"
import { getItemNames, createItemName, deleteItemName } from "../services/storage/ItemName.service.js"
import { getPlaces, createPlace, deletePlace } from "../services/storage/Storage.service.js"
import { storeItem , deleteStoredItem, updateStoredItem } from "../services/storage/StorageConn.service.js";

import { Router } from "express"
import pkg from 'jsonwebtoken';
const { sign } = pkg;
const router = Router()

//Middleware skipping login and for development purposes register and password change 
router.use((req, res, next) => {
    if (req.path === '/login' || req.path ==='/register' || req.path ==='/passwordChange') {
        return next(); 
    }
    return authMiddle(req, res, next);
});

//STORAGE_PLACE endpoints 
//GET
router.get("/storagePlace", 
    async function(req, res, next){
        try{
            res.json(await getPlaces())
        }
        catch(err){
            next(err)
        }
})
//POST
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
//DELETE
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

//ITEM_NAME endpoints
//GET
router.get("/itemName", 
    async function(req, res, next){
        try{
            res.json(await getItemNames())
        }
        catch(err){
            next(err)
        }
})
//POST
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
// //PUT
// router.put("/itemName/:id",
//     async function(req, res, next){
//         try{
//             const {id} = req.params
//             const {item} = req.body
//             res.json(await updateItemName(id, item))         
//         }
//         catch(err){
//             next(err)
//         }
// })
//DELETE
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

//ITEM endpoints
//GET
router.get("/item", 
    async function(req, res, next){
        try{
            res.json(await getItem())
        }
        catch(err){
            next(err)
        }
})
//POST
router.post("/item", 
    async function(req, res, next){
        try{
            const httpMethod = req.method
            const createdBy = req.user.id
            const {itemNameId, storagePlaceId, quantity} = req.body

            if (!itemNameId || !storagePlaceId  || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const createdItems = await createItem(itemNameId, quantity);
            
            let itemId = 0
            
            for (let i = 0; i < createdItems.length; i++) {
                itemId = createdItems[i].id;
                let item = await Item.findOne({where: {id:itemId}})

                await storeItem(itemId, storagePlaceId);
                await createLogs(itemId, itemNameId, storagePlaceId, createdBy, httpMethod)
            }

            res.status(201).json({ message: `Item created` });
        }
        catch(err){
            next(err)
        }
})
//PUT
router.put("/item",
    async function (req, res, next) {

        try{
            const createdBy = req.user.id
            const httpMethod = req.method
            const {itemIdList, storagePlaceId, newStoragePlaceId} = req.body

            let itemId = 0

            for (let i = 0; i<itemIdList.length; i++){
                itemId = itemIdList[i]
                let item = await Item.findOne({where: {id:itemId}})

                await createLogs(itemId, item.itemNameId, storagePlaceId, createdBy, httpMethod)
                await createLogs(itemId, item.itemNameId, newStoragePlaceId, createdBy, httpMethod)
                await updateStoredItem(itemId, newStoragePlaceId)
            }

            res.status(200).json({ message: 'Item placed into another storage place' });
        }
        catch(err){
            next(err)
        }
})
//DELETE 
router.delete("/item",
    async function(req, res, next){
        try{
            const httpMethod = req.method
            const createdBy = req.user.id
            const {itemIdList, storagePlaceId} = req.body
            
            
            let itemId = 0
            for (let i = 0; i < itemIdList.length; i++) {
                itemId = itemIdList[i];
                let item = await Item.findOne({where: {id:itemId}})
                await createLogs(itemId, item.itemNameId, storagePlaceId,  createdBy, httpMethod)
                await deleteStoredItem(itemId);
                await deleteItem(itemId);
            }
            res.status(200).json({ message: `Item deleted` });
        
        }
        catch(err){
            next(err)
        }
})


//FUNCTIONALITY
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
            const token = sign({ id: user.id, isAdmin: user.isAdmin, isFirstLogin: user.isFirstLogin }, process.env.SECRET_KEY, { expiresIn: "4h" });

            return res.status(200).json({token, message: "Login successful" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/register',  async (req, res) => {
    try {
        //const userPassword = await genPassword() 
        const { userEmail, userPassword,  isAdmin } = req.body
        
        if (!userEmail || userEmail==""|| isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const user = await createUser(userEmail, userPassword, isAdmin)

        // await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(userPassword)}`, `Jelszó: ${String(userPassword)}`)
        return res.status(201).json({ message: `User created` })
    } catch (error) {
        return res.status(500).json({ message: error.message })
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

export default router