import { sequelize } from "../config.js"; 
import pkg from 'sequelize';
const { DataTypes } = pkg;


const ItemName = sequelize.define('ItemName', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    item: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true    
    }},
    {
        tableName: 'ITEM_NAME',
        timestamps: false 
    }
);


export{ 
    ItemName
};