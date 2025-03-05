import { ItemName } from "../../models/ItemNameModel.js";
import { Items } from "../../models/ItemsModel.js";
import { StoragePlace } from "../../models/StoragePlaceModel.js";
import Sequelize from 'sequelize';
const { Op } = Sequelize;

async function getItems() {
    try {
    const items = await Items.findAll();
    const formattedItems = await Promise.all(
        items.filter(item => item.isActive !== false).map(async (item) => {
        const [ itemStorage, itemName] = await Promise.all([
            
            StoragePlace.findOne({ where: { id: item.storagePlaceId } }),
            ItemName.findOne({ where: { id: item.itemNameId } })
        ]);

        

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
        throw new Error("Error fetching items");
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
        const item = await Items.bulkCreate(newItems);
        return item;
    }catch (error) {
        throw new Error("Failed to create item(s)" + error);
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
        throw new Error("Failed to delete item");
    }
    
}


async function updateItem(storagePlaceId, description, quantity) {

    try{
        const items = await Items.findAll(
            {where: {
                storagePlaceId: {
                  [Op.ne]: storagePlaceId
                }},
            order: [['id', 'DESC']],
            limit: parseInt(quantity)
        })
       
        items.forEach(item => {
            item.set({
                storagePlaceId: storagePlaceId,
                description: description
            });
        });
        await Promise.all(items.map(item => item.save()));
        
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