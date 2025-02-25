const {Value} = require("../models/ValueModel")

async function getValues(){
    try {
        const values = await Value.findAll()
        return values
    } catch (error) {
        return{message: error.message + "Failed to fetch values"}
    }
}

async function createValue(value){
    try {
        const val = await Value.create({value: value});
        return {message: "Value created successfully"}
    } catch (error) {
        return{message: error.message + "Failed to create value"}
    }
    
}

module.exports = {
    getValues,
    createValue
}