import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js";

const StorageConn = sequelize.define('StorageConn', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    storagePlaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
    {
        tableName: 'STORAGE_CONN',
        timestamps: false 
    }
);

export{ 
    StorageConn
}