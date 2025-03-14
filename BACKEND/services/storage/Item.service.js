import { Item } from "../../models/ItemModel.js";
import Sequelize from 'sequelize';
const { Op } = Sequelize;

async function getItem() {
    try {
    const Item = await Item.findAll();
   
        
        
    const result = Item.map(item => ({
        id: item.id,
        itemNameId: item.itemNameId
    }));


            return result
        
    } catch (error) {
        throw new Error("Error fetching Item");
    }
}



async function createItem(itemNameId, quantity){

    let newItem = [];

    for (let i = 0; i < quantity; i++) {
        newItem.push({
            itemNameId: itemNameId
        });
    }
    try{
        const item = await Item.bulkCreate(newItem);
        return item;
    }catch (error) {
        throw new Error("Failed to create item(s)" + error);
    }


}

async function deleteItem(itemNameId, storagePlaceId, description, quantity){
    try{
        const item = await Item.findOne({where:{
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
        const Item = await Item.findOne(
            {where: {
                storagePlaceId: storagePlaceId,
                itemNameId: itemNameId
            }
            
        })
        
        Item.set({
            storagePlaceId: storagePlaceId,
            description: description,
            quantity: Item.quantity-quantity
        });
        
        await Item.save()
        let newItem = await Item.findOne({where:{itemNameId: itemNameId, storagePlaceId: newStoragePlaceId}});
            if (!newItem) {
                newItem = await Item.create({
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
    getItem,
    createItem, 
    deleteItem,
    updateItem
}