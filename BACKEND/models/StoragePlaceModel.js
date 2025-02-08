const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js"); 

const StoragePlace = sequelize.define('StoragePlace', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    storage: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    }},
    {
        tableName: 'storage_place',
        timestamps: false 
    }
);


module.exports = { 
    StoragePlace 
};