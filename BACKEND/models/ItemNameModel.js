import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js"; 

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


export{ 
    ItemName
};