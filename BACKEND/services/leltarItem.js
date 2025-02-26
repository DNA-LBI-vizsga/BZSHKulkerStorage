const Sequelize = require('sequelize');
const { Op } = Sequelize
const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { Value } = require("../models/ValueModel");
const { StoragePlace } = require("../models/StoragePlaceModel");


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

    

    const latestItem = await Items.findOne({
        where: { 
            item_name_id: itemName.id,
            product_code: {
                [Op.ne]: null
            }  
        },
        order: [['id', 'DESC']],
    });

    
    let lastNumber = 0

    if (latestItem) {
        let codeParts = latestItem.product_code.split('-');
        lastNumber = parseInt(codeParts[codeParts.length - 1]);
        
    } else {
        lastNumber = 0
    }   
    
    



    
    const newItems = [];
    



  
        console.log(itemVal.value)
        if (itemVal.value == "Drága"){
            for (let i = 1; i <= quantity; i++) {
                const newNumber = String(lastNumber + i).padStart(4, '0');
                const item_code = `BZSH-${itemName.item}-${newNumber}`;
                
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






module.exports = {
    getItems,
    createItem
}