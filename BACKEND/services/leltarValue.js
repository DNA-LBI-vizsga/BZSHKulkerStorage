const {Value} = require("../models/ValueModel")

async function getValues(){
    try {
        const values = await Value.findAll()
        return values
    } catch (error) {
        return{message: error.message + "Failed to fetch values"}
    }
}

module.exports = {
    getValues
}