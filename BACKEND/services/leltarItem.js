const Sequelize = require('sequelize');
const moment = require('moment-timezone')
const { Op } = Sequelize
const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");

const { StoragePlace } = require("../models/StoragePlaceModel");
const functions = require("../services/leltarFunctions");
const { User } = require('../models/UserModel');


async function getItems() {
    try {
    const items = await Items.findAll();
    const formattedItems = await Promise.all(
        items.filter(item => item.isActive !== false).map(async (item) => {
        const [ itemStorage, itemName, createdByUser, updatedByUser] = await Promise.all([
            
            StoragePlace.findOne({ where: { id: item.storagePlaceId } }),
            ItemName.findOne({ where: { id: item.itemNameId } }),
            User.findOne({ where: { id: item.createdBy } }),
            User.findOne({ where: { id: item.updatedBy } })
        ]);

        const createdAt = moment(item.createdAt).format('YYYY.MM.DD HH:mm:ss');
        const updatedAt = moment(item.updatedAt).format('YYYY.MM.DD HH:mm:ss');

        

            return{
                id: item.id,
                item: itemName.item,
                storage: itemStorage.storage,
                description: item.description
            }


        
        })
    );

    return formattedItems;
    } catch (error) {
    console.error(error);
    return { message: "Error fetching items" };
    }
}




async function createItem(itemNameId, storagePlaceId, createdBy, description, quantity){
    

    
    const newItems = [];

    for(let i = 0; i<quantity; i++){
        newItems.push({
            itemNameId: itemNameId,
            storagePlaceId: storagePlaceId,
            createdBy: createdBy,
            description: description,
            isActive: true
    })
    }
    
    
    console.log(newItems)

    try{
        await Items.bulkCreate(newItems);
        return { message: 'Items added successfully' };
    }catch (error) {
        console.error(error);
        return { message: 'Error adding items' };
    }


}

async function deleteItem(id){
    try{
        const item = await Items.findOne({where:{id:id}}); 
        item.set({
            isActive: 0
        })
            
        item.save()
        
        return {message: "Item deleted"}
    }
    catch(err){
        return {message: err.message + "Failed to delete item"}
    }
    
}


async function updateItem(id, updatedBy, storagePlaceId, itemNameId, description) {

    try{
        const item = await Items.findOne({where:{id:id}}) 
        item.set({
            updatedBy: updatedBy,
            storagePlaceId: storagePlaceId,
            itemNameId: itemNameId,
            description: description
        })
        await item.save();
        return {message: "Item updated"}
    }
    catch(err){
        return {message: err.message + "Failed to update item"}
    }    
}




module.exports = {
    getItems,
    createItem, 
    deleteItem,
    updateItem
}