const { ItemName } = require("../models/ItemNameModel");

async function getItemNames() {
try {
    const item = await ItemName.findAll(); // Sequelize ORM method to get all items
    return item 
} catch (error) {
    console.error("Error fetching item names:", error);
    return "Error fetching item names";
}
}
async function createItemName(item_name){
    try{
        const item = await ItemName.create(
            { item: item_name }
        )
        return {message: "Item created successfully"} 
    }
    catch(err){
        return {message: err.message + "Failed to create item"}
    }
    
}

async function updateItemName(id, item_name){
    try{
        const item = await ItemName.findOne({ where: {id: id}});
        item.set({
            item: item_name
        });
        await item.save();
        return {message: "Item updated successfully"} 
    }
    catch(err){
        return {message: err.message + "Failed to update item"}
    }
    
}

async function deleteItemName(id){
    try{
        const item = await ItemName.findOne({ where: {id: id}});
        await item.destroy();
        return {message: "Item deleted"}
    }
    catch(err){
        return {message: err.message + "Failed to delete item"}
    }
    
}
module.exports = {
    getItemNames,
    createItemName,
    updateItemName,
    deleteItemName
}