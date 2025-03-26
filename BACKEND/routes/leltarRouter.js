import { Item } from "../models/ItemModel.js"
import { StorageConn } from "../models/StorageConnModel.js"

import { updateUser, createUser, disableUser, enableUser, deleteAdminRole, addAdminRole, getUser } from "../services/auth/User.service.js"
import { authMiddle, checkPassword, checkRequiredFields, genPassword, sendEmail, firstLoginFalse, validateAdmin } from "../services/auth/utilFunctions.utils.js"

import { getLogs, createExcel } from "../services/log/ExcelLog.service.js"
import { createLogs } from "../services/log/Logs.service.js"

import { getItem, createItem, deleteItem } from "../services/storage/Item.service.js"
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

/**
 * @swagger
 * /storagePlace:
 *  get:
 *     tags:
 *      - Storage Place Management
 *     summary: Retrieve all storage places
 *     description: Fetches a list of all storage places from the database. Requires authentication.
 *     security:
 *       - bearerAuth: [] # Authentication requirement
 *     responses:
 *       200:
 *         description: A list of storage places.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the storage place.
 *                   name:
 *                     type: string
 *                     description: The name of the storage place.
 */
router.get("/storagePlace", 
    async function(req, res, next){
        try{
            res.status(200).json(await getPlaces())
        }
        catch(err){
            next(err)
        }
})
//POST
/**
 * @swagger
 * /storagePlace:
 *  post:
 *     tags:
 *      - Storage Place Management
 *     summary: Create a new storage place
 *     description: Adds a new storage place to the database. Requires authentication.
 *     security:
 *       - bearerAuth: [] # Authentication requirement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storage:
 *                 type: string
 *                 example: "Main Warehouse"
 *     responses:
 *       201:
 *         description: Storage place created successfully.
 *    
 */
router.post("/storagePlace", validateAdmin,
    async function(req, res, next){
        try{
            const {storage} = req.body
            await checkRequiredFields(storage, res)
            res.status(201).json(await createPlace(storage))
        }
        catch(err){
            next(err)
        }
})
//DELETE
/**
 * @swagger
 * /storagePlace/{id}:
 *  delete:
 *     tags:
 *      - Storage Place Management
 *     summary: Delete a storage place
 *     description: Removes a storage place from the database by its unique identifier. Requires authentication.
 *     security:
 *       - bearerAuth: [] # Authentication requirement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the storage place to delete.
 *     responses:
 *       200:
 *         description: Storage place deleted successfully.
 */
router.delete("/storagePlace/:id", validateAdmin,
    async function(req, res, next){
        try{
            const {id} = req.params
            res.status(200).json(await deletePlace(id))
        }
        catch(err){
            next(err)
        }
})

//ITEM_NAME endpoints
//GET
/**
 * @swagger
 * /itemName:
 *   get:
 *     tags:
 *      - Item Name Management
 *     summary: Retrieve all item names
 *     description: Fetches a list of all item names from the database.
 *     security:
 *       - bearerAuth: [] # Authentication requirement
 *     responses:
 *       200:
 *         description: A list of item names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the item name.
 *                   name:
 *                     type: string
 *                     description: The name of the item.
 */
router.get("/itemName", 
    async function(req, res, next){
        try{
            res.status(200).json(await getItemNames())
        }
        catch(err){
            next(err)
        }
})
//POST
/**
 * @swagger
 * /itemName:
 *   post:
 *     tags:
 *      - Item Name Management
 *     summary: Create a new item name
 *     description: Adds a new item name to the database.
 *     security:
 *      - bearerAuth: [] # Authentication requirement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 description: The name of the item to create.
 *                 example: "Sample Item Name"
 *     responses:
 *       201:
 *         description: Item name created successfully.
 */
router.post("/itemName", validateAdmin, 
    async function(req, res, next){
        try{
            const {item} = req.body
            await checkRequiredFields(item, res)
            res.status(201).json(await createItemName(item))
        }
        catch(err){
            next(err)
        }
})
//DELETE
/**
 * @swagger
 * /itemName/{id}:
 *   delete:
 *     tags:
 *      - Item Name Management
 *     summary: Delete an item name
 *     description: Removes an item name from the database by its unique identifier.
 *     security:
 *      - bearerAuth: [] # Authentication requirement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the item name to delete.
 *     responses:
 *       200:
 *         description: Item name deleted successfully.
 * 
 */
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

//ITEM endpoints
//GET
/**
 * @swagger
 * /item:
 *   get:
 *     tags:
 *      - Item Management
 *     summary: Retrieve all items
 *     description: Fetches a list of all items from the database.
 *     responses:
 *       200:
 *         description: A list of items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the item.
 *                   itemNameId:
 *                     type: integer
 *                     description: The ID of the item name associated with the item.
 *                   storagePlaceId:
 *                     type: integer
 *                     description: The ID of the storage place where the item is stored.
 * 
 */
router.get("/item", 
    async function(req, res, next){
        try{
            res.status(200).json(await getItem())
        }
        catch(err){
            next(err)
        }
})
//POST
/**
 * @swagger
 * /item:
 *   post:
 *     tags:
 *      - Item Management
 *     summary: Create a new item    
 *     description: Adds a new item to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemNameId:
 *                 type: integer
 *                 description: The ID of the item name associated with the item.
 *               storagePlaceId:
 *                 type: integer
 *                 description: The ID of the storage place where the item is stored.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the item.
 *     responses:
 *       201:
 *         description: Item created successfully.
 */
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
/**
 * @swagger
 * /item:    
 *   put:    
 *     tags:
 *      - Item Management
 *     summary: Move items to another storage place
 *     description: Moves items to another storage place.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIdList: 
 *                 type: array
 *                 description: An array of item IDs to move.
 *                 default: []
 *               newStoragePlaceId:
 *                 type: integer
 *                 description: The ID of the new storage place to move the items to.
 *     responses:
 *       200:
 *         description: Items moved successfully.
 */
router.put("/item", validateAdmin,
    async function (req, res, next) {

        try{
            const createdBy = req.user.id
            const httpMethod = req.method
            const {itemIdList,newStoragePlaceId} = req.body

            let itemId = 0

            for (let i = 0; i<itemIdList.length; i++){
                itemId = itemIdList[i]
                let item = await Item.findOne({where: {id:itemId}})
                let storage = await StorageConn.findOne({where: {itemId:itemId}})
                console.log(storage.storagePlaceId)
                if(storage.storagePlaceId != newStoragePlaceId){
                    await createLogs(itemId, item.itemNameId, storage.storagePlaceId, createdBy, httpMethod)
                    await createLogs(itemId, item.itemNameId, newStoragePlaceId, createdBy, httpMethod)      
                }
                await updateStoredItem(itemId, newStoragePlaceId)
            }

            res.status(200).json({ message: 'Item placed into another storage place' });
        }
        catch(err){
            next(err)
        }
})
//DELETE 
/**
 * @swagger
 * /item:
 *   delete:
 *     tags:
 *      - Item Management
 *     summary: Delete items
 *     description: Deletes items from the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIdList:
 *                 type: array
 *                 description: An array of item IDs to delete.
 *                 default: []
 *     responses:
 *       200:
 *         description: Items deleted successfully.
 */
router.delete("/item", validateAdmin,
    async function(req, res, next){
        try{
            const httpMethod = req.method
            const createdBy = req.user.id
            const {itemIdList} = req.body
            
            
            let itemId = 0
            for (let i = 0; i < itemIdList.length; i++) {
                itemId = itemIdList[i];
                let storage = await StorageConn.findOne({where: {itemId:itemId}});
                let item = await Item.findOne({where: {id:itemId}});
                await createLogs(itemId, item.itemNameId, storage.storagePlaceId,  createdBy, httpMethod)
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
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *      - User Management
 *     summary: Get all users
 *     description: Retrieves a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 */

router.get('/users', validateAdmin, async (req, res) => {
    try {
        return res.status(200).json(await getUser());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /disable:
 *   patch:
 *     tags:
 *      - User Management
 *     summary: Disable a user
 *     description: Disables a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email of the user to disable.
 *     responses:
 *       200:
 *         description: User disabled successfully.
 */
router.patch('/disable', validateAdmin, async (req, res) => {
    try {
        const { userEmail } = req.body;

        await checkRequiredFields(userEmail, res);

        return res.status(200).json(disableUser(userEmail));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /enable:
 *   patch:
 *     tags:
 *      - User Management
 *     summary: Enable a user
 *     description: Enables a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email of the user to enable.
 *     responses:
 *       200:
 *         description: User enabled successfully.
 */
router.patch('/enable', validateAdmin, async (req, res) => {
    try {
        const { userEmail } = req.body;

        await checkRequiredFields(userEmail, res);

        return res.status(200).json(enableUser(userEmail));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /demote:
 *   patch:
 *     tags:
 *      - User Management
 *     summary: Demote a user from admin
 *     description: Demotes a user from admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email of the user to demote.
 *     responses:
 *       200:
 *         description: User demoted successfully.
 */
router.patch('/demote', validateAdmin, async (req, res) => {
    try {
        const { userEmail } = req.body;

        await checkRequiredFields(userEmail, res);

        return res.status(200).json(deleteAdminRole(userEmail));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /promote:
 *   patch:
 *     tags:
 *      - User Management
 *     summary: Promote a user to admin
 *     description: Promotes a user to admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email of the user to promote.
 *     responses:
 *       200:
 *         description: User promoted successfully.
 */
router.patch('/promote', validateAdmin, async (req, res) => {
    try {
        const { userEmail } = req.body;

        await checkRequiredFields(userEmail, res);

        return res.status(200).json(addAdminRole(userEmail));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *      - User Management
 *     summary: Login a user
 *     description: Logs in a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email of the user.
 *               userPassword:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
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
            const token = sign({ id: user.id, isAdmin: user.isAdmin, isDisabled: user.isDisabled, isFirstLogin: user.isFirstLogin }, process.env.SECRET_KEY, { expiresIn: "4h" });

            return res.status(200).json({token, message: "Login successful" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *      - User Management
 *     summary: Register a new user
 *     description: Registers a new user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: The email address of the user.
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the user is an admin or not.
 *     responses:
 *       201:
 *         description: User created successfully.
 */
router.post('/register',   async (req, res) => {
    try {
        //const userPassword = await genPassword() 
        const { userEmail, userPassword,  isAdmin } = req.body
        
        if (!userEmail || userEmail==""|| isAdmin==null) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const user = await createUser(userEmail, userPassword, isAdmin)

        //await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(userPassword)}`, `Jelszó: ${String(userPassword)}`)
        return res.status(201).json({ message: `User created` })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});
/**
 * @swagger
 * /firstLogin:
 *   put:
 *     tags:
 *      - User Management
 *     summary: Change password on first login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userPassword:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Password changed
 * */
router.put("/firstLogin", 
    async function(req, res, next){
        try{
            const user = await firstLoginFalse(req)
            const {userPassword} = req.body

            res.status(200).json(await updateUser(user.userEmail, userPassword))
        }
        catch(err){
            next(err)
        }
})

/**
 * @swagger
 * /passwordChange:
 *   put:
 *     tags:
 *       - User Management
 *     summary: Change password
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *                 description: An email of the user
 *     responses:
 *       200:
 *         description: Password changed
 */

router.put("/passwordChange",
    async function(req, res, next){
        try{
        const {userEmail} = req.body
        const newPassword = await genPassword() 

        await sendEmail(userEmail, 'Jelszó', `Jelszó: ${String(newPassword)}`, `Jelszó: ${String(newPassword)}`)
        res.status(200).json(await updateUser(userEmail, newPassword))  
    }
    catch(err){
        next(err)
    }
}
)

/**
 * @swagger
 * /log:
 *   post:
 *     tags:
 *       - Log Management
 *     summary: Get logs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemNameId:
 *                 type: integer
 *                 description: An ID of the itemName
 *               storagePlaceId:
 *                 type: integer
 *                 description: An ID of the storagePlace
 *               createdBy:
 *                 type: integer
 *                 description: An ID of the user
 *               fromDate:
 *                 type: string
 *                 description: A start date
 *               toDate:
 *                 type: string
 *                 description: An end date
 *     description: Get logs from the database
 *     responses:
 *       200:
 *         description: Logs fetched successfully
 */

router.post('/log', validateAdmin, async (req, res) => {
    try {

        const data = await getLogs(req); 
        const excelBuffer = await createExcel(data);
        
        res.setHeader('Content-Disposition', 'attachment; filename="logs.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(Buffer.from(excelBuffer));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating Excel file");
    }
});

export default router