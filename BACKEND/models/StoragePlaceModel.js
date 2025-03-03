import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js";

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


export{ 
    StoragePlace 
};