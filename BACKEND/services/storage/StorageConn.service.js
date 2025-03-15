import { StorageConn } from "../../models/StorageConnModel.js";


//Connecting item to storage
async function storeItem(itemId, storagePlaceId) {
    
    const items = {
        itemId: itemId,
        storagePlaceId: storagePlaceId
    }
    

    try{
        const storage = await StorageConn.create(items);
        return  { message: "Item stored successfully" };
    }
    catch(err){
        throw new Error("Failed to store item" + err);
    }
}

async function deleteStoredItem(itemId) {
    try{
        await StorageConn.destroy({
            where: {
                itemId: itemId
            }
        })
        return { message: "Item deleted" };
    }
    catch(err){
        throw new Error("Failed to delete item" + err);
    }
}


async function updateStoredItem(itemId, storagePlaceId) {
    try{
        const storedItem = await StorageConn.findOne({
            where: {
                itemId: itemId
            }
        })

        storedItem.set({
            storagePlaceId: storagePlaceId,
        });

        await storedItem.save();
        return { message: "Item updated" };
    }
    catch(err){
        throw new Error("Failed to update item" + err);
    }
}

export {
    storeItem,
    deleteStoredItem,
    updateStoredItem
};