import { ActionType } from "../../models/ActionTypeModel.js";

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


export{
    createActionType
}