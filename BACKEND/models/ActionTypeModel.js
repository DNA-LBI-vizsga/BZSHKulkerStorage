import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js"; 

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


export{ 
    ActionType
};