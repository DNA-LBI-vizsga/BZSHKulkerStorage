import { Logs } from "../../models/LogModel.js";


async function createLogs(itemId, itemNameId, storagePlaceId, createdBy, httpMethod) {
    try {
        
        let actionType

        if (httpMethod === "POST") {
            actionType = 'ADD';
        } else if (httpMethod === "PUT") {
            actionType = 'UPDATE';
        } else if (httpMethod === "DELETE") {
            actionType = 'DELETE';
        }
        else{ 
            console.log("Method is not recognized for logging");
            return
        }
        const logs = []

        logs.push({
            itemId: itemId,
            storagePlaceId: storagePlaceId,
            itemNameId: itemNameId,
            actionType: actionType,
            createdBy: createdBy
    })

        await Logs.bulkCreate(logs)
        
    } catch (error) {
        console.error("Error logging action: ", error);
    }
    
}

export{
    createLogs
}