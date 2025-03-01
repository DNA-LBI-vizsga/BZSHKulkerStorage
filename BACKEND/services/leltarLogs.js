const { Logs } = require("../models/LogModel");


async function createLogs(itemId, updatedBy, httpMethod) {
    try {
        
        let actionId

        if(httpMethod == "POST")  actionId = 1
        else if(httpMethod == "PUT")  actionId = 2
        else if(httpMethod == "PATCH")  actionId = 3
        else{ 
            console.log("Method is not recognized for logging");
            return
        }
        const logs = []

        logs.push({
            itemId: itemId,
            actionTypeId: actionId,
            updatedBy: updatedBy
    })

        await Logs.bulkCreate(logs)
        
    } catch (error) {
        console.error("Error logging action: ", error);
    }
    
}

module.exports = {
    createLogs
}