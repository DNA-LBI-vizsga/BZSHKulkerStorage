const { ItemName } = require("../models/ItemNameModel");
const { Items } = require("../models/ItemsModel");
const { Value } = require("../models/ValueModel");


Value.hasMany(Items, { foreignKey: 'value_id'})

async function getItems(){
    try {
        const items = await Items.findAll()

        return items
    } catch (error) {
        return {message: "Error fetching items"}
    }
}



async function createItem(item_name_id, value_id, storage_place_id, user_id, description, quantity){
    
    const item_name = await ItemName.findOne({
        where: { id: item_name_id },
        attributes: ['item']
    });

    

    const latestItem = await Items.findOne({
        where: { item_name_id: item_name_id },
        order: [['id', 'DESC']],
    });

    
    let lastNumber = 0

    if (latestItem) {
        let codeParts = latestItem.product_code.split('-');
        lastNumber = parseInt(codeParts[codeParts.length - 1]);
        
    } else {
        lastNumber = 0
    }   
    
    const valueForCode = await Items.findOne(
        {
            where:{id: value_id},
            include:{
                model: Value,
                attributes: ['id', 'value']
            }
        }
    )

    


    const newItems = [];

    
    if(valueForCode){
        let itemValue = valueForCode.Value.value
        if (itemValue == "Drága"){
            for (let i = 1; i <= quantity; i++) {
                const newNumber = String(lastNumber + i).padStart(4, '0');
                const item_code = `BZSH-${item_name.item}-${newNumber}`;
                
                newItems.push({
                    item_name_id,
                    value_id,
                    storage_place_id,
                    user_id,
                    product_code: item_code,
                    description,
                });
            }
        }else{
            for (let i = 1; i <= quantity; i++) {
            newItems.push({
                item_name_id,
                value_id,
                storage_place_id,
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

}






module.exports = {
    getItems,
    createItem
}