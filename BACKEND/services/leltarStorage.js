const { StoragePlace } = require("../models/StoragePlaceModel");


//storage_place endpoints
async function getPlaces() {
    try {
        const storage = await StoragePlace.findAll(); // Sequelize ORM method to get all items
        return storage 
    } catch (error) {
        console.error("Error fetching item names:", error);
        return "Error fetching item names";
    }
    }



async function createPlace(storage_place){
    try{
        const storage = await StoragePlace.create(
            { storage: storage_place }
        )
        return {message: "Storage place created"}
    }
    catch(err){
        return {message: err.message + "Failed to create storage place"}
    }
    
}

async function deletePlace(id){
    try{
        const storage = await StoragePlace.findOne({where:{id:id}}); 
        storage.destroy()
            
        
        return {message: "Storage place deleted"}
    }
    catch(err){
        return {message: err.message + "Failed to delete storage place"}
    }
    
}


module.exports = {
    getPlaces,
    createPlace,
    deletePlace
}