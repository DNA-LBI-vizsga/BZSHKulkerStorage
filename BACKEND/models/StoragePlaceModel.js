import { sequelize } from "../config.js"; 
import pkg from 'sequelize';
const { DataTypes } = pkg;


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
    }
},
    {
        tableName: 'STORAGE_PLACE',
        timestamps: false 
    }
);


export{ 
    StoragePlace 
};