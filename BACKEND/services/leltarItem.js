const Sequelize = require('sequelize');
const { Op } = Sequelize
const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { Value } = require("../models/ValueModel");
const { StoragePlace } = require("../models/StoragePlaceModel");
const functions = require("../services/leltarFunctions")


async function getItems(){
    try {
        const items = await Items.findAll()

        return items
    } catch (error) {
        return {message: "Error fetching items"}
    }
}



async function createItem(item_name, value, storage_place, user_id, description, quantity){
    
    const itemVal = await Value.findOne({ where:{ value: value}})
    const itemStorage = await StoragePlace.findOne({ where:{ storage: storage_place}})
    const itemName = await ItemName.findOne({ where:{ item: item_name}})

    

    

    
    
    
    
    
    
    const newItems = [];
    
    
    
    let latestItem = await functions.latestItemQuery()
    console.log(latestItem)

    let lastNumber = await functions.getLastNumber(latestItem)
    console.log(lastNumber)
        
        if (itemVal.value == "Drága"){
            for (let i = 1; i <= quantity; i++) {
                let item_code = await functions.createCode(lastNumber, itemName.item, i)
                
                newItems.push({
                    item_name_id: itemName.id,
                    value_id: itemVal.id,
                    storage_place_id: itemStorage.id,
                    user_id,
                    product_code: item_code,
                    description,
                });
            }
        }else{
            for (let i = 1; i <= quantity; i++) {
            newItems.push({
                item_name_id: itemName.id,
                value_id: itemVal.id,
                storage_place_id: itemStorage.id,
                product_code: null,
                user_id,
                description,
            });
        }   
    }
    
    // if(valueForCode){
    //     let itemValue = valueForCode.Value.value

    


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
        item.destroy()
            
        
        return {message: "Item deleted"}
    }
    catch(err){
        return {message: err.message + "Failed to delete item"}
    }
    
}


async function updateItem(id, update_id, newValue = null, newStorage = null, newItemName = null, newDescription) {

    try{
        const item = await Items.findOne({where:{id:id}}) 
        if (item){
            
            if (newValue !== null){
                const itemVal = await Value.findOne({ where:{ value: newValue}})
                item.set({
                    updated_by: update_id,
                    value_id: itemVal.id
                })
                if(newItemName == null){
                    
                    if (newValue == "Drága"){
                        let latestItem = await functions.latestItemQuery(id)
                        let lastNumber = await functions.getLastNumber(latestItem)
                        let item_code = await functions.createCode(lastNumber, item.item_name, 1) 
                        item.set({
                            product_code: item_code
                        })    
                    }else{
                        item.set({
                            product_code: null
                        })
                        }
                }
                if(newItemName != null){
                    if (newValue == "Drága"){
                        let latestItem = await functions.latestItemQuery(id)
                        let lastNumber = await functions.getLastNumber(latestItem)
                        let item_code = await functions.createCode(lastNumber, newItemName, 1) 
                        item.set({
                            product_code: item_code
                        })
                    }else{
                        item.set({
                            product_code: null
                        })
                        }
                }
                
            }
            if (newStorage !== null){
                const itemStorage = await StoragePlace.findOne({ where:{ storage: newStorage}})
                item.set({
                    updated_by: update_id,
                    storage_place_id: itemStorage.id
                })
            }
            if (newItemName !== null){
                const itemName = await ItemName.findOne({ where:{ item: newItemName}})
                item.set({
                    updated_by: update_id,
                    item_name_id: itemName.id 
                })
            }
            if (newDescription !== null){
                item.set({
                    updated_by: update_id,
                    description: newDescription 
                })
            }
            
        }
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