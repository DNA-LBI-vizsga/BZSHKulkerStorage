import { Item } from "../../models/ItemModel.js";

import { StorageConn } from "../../models/StorageConnModel.js";

//item CRUD
async function getItem() {
    try {
        const items = await Item.findAll({
            include: [
                {
                  model: StorageConn,
                  as: 'StorageConns',
                  attributes: ['storagePlaceId']
                }
              ],
              attributes: ['id', 'itemNameId']
            });
      
          const result = items.map(item => ({
              id: item.id,
              itemNameId: item.itemNameId,
              storagePlaceId: item.StorageConns[0].storagePlaceId
          }));
          return result
        
    } catch (error) {
        throw new Error("Error fetching Item" + error);
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

async function deleteItem(itemId){
    try{
        const item = await Item.findOne({where:{
            id:itemId,
        }}); 
            
        item.destroy()
        
        return {message: "Item deleted"}
    }
    catch(err){
        throw new Error("Failed to delete itemssss " + err);
    }
    
}


async function updateItem(itemId, storagePlaceId, newStoragePlaceId) {

    try{
        const item = await Item.findOne(
            {where: {
                id: itemId,
            }
            
        })
        
        item.set({
            storagePlaceId: newStoragePlaceId,
        });
        
        await item.save()
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