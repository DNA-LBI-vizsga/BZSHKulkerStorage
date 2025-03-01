const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js"); 

const ActionType = sequelize.define('ActionType', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    actionType: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true
    }},
    {
        tableName: 'action_type',
        timestamps: false 
    }
);


module.exports = { 
    ActionType
};