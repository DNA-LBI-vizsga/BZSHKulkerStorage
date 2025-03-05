import { StoragePlace } from "../../models/StoragePlaceModel.js";


//storage_place endpoints
async function getPlaces() {
    try {
        const storage = await StoragePlace.findAll(); // Sequelize ORM method to get all items
        return storage 
    } catch (error) {
        throw new Error("Error fetching item names");
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
        throw new Error("Failed to create storage place" + err);
    }
    
}

async function deletePlace(id){
    try{
        const storage = await StoragePlace.findOne({where:{id:id}}); 
        storage.destroy()
            
        
        return {message: "Storage place deleted"}
    }
    catch(err){
        throw new Error("Failed to delete storage place");
    }
    
}


export{
    getPlaces,
    createPlace,
    deletePlace
}