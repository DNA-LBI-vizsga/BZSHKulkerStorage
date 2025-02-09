const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js"); 

const ItemName = sequelize.define('ItemName', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    item: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true
    }},
    {
        tableName: 'item_name',
        timestamps: false 
    }
);


module.exports = { 
    ItemName
};