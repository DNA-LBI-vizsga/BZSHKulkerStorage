const { Items } = require("../models/ItemsModel");

async function getItems(){
    try {
        const items = await Items.findAll()

        return items
    } catch (error) {
        return {message: "Error fetching items"}
    }
}






module.exports = {
    getItems
}