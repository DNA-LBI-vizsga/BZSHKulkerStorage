import { StoragePlace } from "../../models/StoragePlaceModel.js";


//StoragePlace CRUD - allowing the admin to create a storage list which a user can choose from
async function getPlaces() {
    try {
        const storage = await StoragePlace.findAll(); // Sequelize ORM method to get all items
        return storage 
    } catch (err) {
        throw new Error("Error fetching item names" + err);
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
        await storage.destroy()
            
        
        return {message: "Storage place deleted"}
    }
    catch(err){
        throw new Error("Failed to delete storage place" + err);
    }
    
}


export{
    getPlaces,
    createPlace,
    deletePlace
}