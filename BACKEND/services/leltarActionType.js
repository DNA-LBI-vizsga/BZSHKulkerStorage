const { ActionType } = require("../models/ActionTypeModel");

async function createActionType(actionType){
    try{
        const action = await ActionType.create(
            { actionType: actionType }
        )
        return {message: "ActionType created successfully"} 
    }
    catch(err){
        throw new Error("Failed to create ActionType");
    }
    
}


module.exports = {
    createActionType
}