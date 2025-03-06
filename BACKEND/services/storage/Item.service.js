import e from "express";
import { ItemName } from "../../models/ItemNameModel.js";
import { Items } from "../../models/ItemsModel.js";
import { StoragePlace } from "../../models/StoragePlaceModel.js";
import Sequelize from 'sequelize';
const { Op } = Sequelize;

async function getItems() {
    try {
    const items = await Items.findAll();
   
        
        
    const result = items.map(item => ({
        itemNameId: item.itemNameId,
        storagePlaceId: item.storagePlaceId,
        quantity: item.quantity,
        description: item.description
    }));


            return result
        
    } catch (error) {
        throw new Error("Error fetching items");
    }
}



async function createItem(itemNameId, storagePlaceId, description, quantity){
    
    let newItems
    const item = await Items.findOne({ where: { itemNameId: itemNameId, storagePlaceId: storagePlaceId }});
    if (item) {
        
        item.set({
            quantity: item.quantity + quantity
        })
        await item.save();
        return item;
    } else{
        newItems = {
            itemNameId: itemNameId,
            storagePlaceId: storagePlaceId,
            description: description,
            quantity: quantity
        }
    }
    
    
    
    console.log(newItems)

    try{
        const items = await Items.create(newItems);
        return items;
    }catch (error) {
        throw new Error("Failed to create item(s)" + error);
    }


}

async function deleteItem(itemNameId, storagePlaceId, description, quantity){
    try{
        const item = await Items.findOne({where:{
            itemNameId:itemNameId,
            storagePlaceId: storagePlaceId
        }}); 
        item.set({
            description: description,
            quantity: item.quantity-quantity
        })
            
        item.save()
        
        return {message: "Item deleted"}
    }
    catch(err){
        throw new Error("Failed to delete item");
    }
    
}


async function updateItem(storagePlaceId, itemNameId, newStoragePlaceId, description, quantity) {

    try{
        const items = await Items.findOne(
            {where: {
                storagePlaceId: storagePlaceId,
                itemNameId: itemNameId
            }
            
        })
        
        items.set({
            storagePlaceId: storagePlaceId,
            description: description,
            quantity: items.quantity-quantity
        });
        
        await items.save()
        let newItem = await Items.findOne({where:{itemNameId: itemNameId, storagePlaceId: newStoragePlaceId}});
            if (!newItem) {
                newItem = await Items.create({
                    itemNameId: itemNameId,
                    storagePlaceId: newStoragePlaceId,
                    description: description,
                    quantity: quantity
                });
            } else {
                newItem.set({   
                    storagePlaceId: newStoragePlaceId,
                    description: description,
                    quantity: newItem.quantity+quantity
                });
            }
        
        
        await newItem.save()
        
        return {message: "Item updated"}
    }
    catch(err){
        throw new Error("Failed to update item" + err);
    }    
}




export{
    getItems,
    createItem, 
    deleteItem,
    updateItem
}