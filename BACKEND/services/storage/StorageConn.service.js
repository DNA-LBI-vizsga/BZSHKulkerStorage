import { StorageConn } from "../../models/StorageConnModel.js";

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

export {
    storeItem
};