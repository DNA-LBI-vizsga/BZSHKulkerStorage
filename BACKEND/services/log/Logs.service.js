import { Logs } from "../../models/LogModel.js";


async function createLogs(itemId, storagePlaceId, quantityChange, createdBy, httpMethod) {
    try {
        
        let actionType

        if (httpMethod === "POST") {
            actionType = 'ADD';
        } else if (httpMethod === "PUT") {
            actionType = 'UPDATE';
        } else if (httpMethod === "PATCH") {
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
            quantityChange: quantityChange,
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