const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js");



const Logs = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    itemId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    actionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    oldValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    newValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    updatedBy:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
    },  
    {
        tableName: 'logs',
        timestamps: true,
        createdAt: false
    }
);

module.exports = {  
    Logs 
};
    