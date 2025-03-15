import { sequelize } from "../config.js"; 
import pkg from 'sequelize';
const { DataTypes } = pkg;



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
    itemNameId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    storagePlaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    actionType: {  
        type: DataTypes.ENUM('ADD', 'UPDATE', 'DELETE'),
        allowNull: false
    },
    createdBy:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
    },  
    {
        tableName: 'LOGS',
        timestamps: true,
        updatedAt: false
    }
);

export{  
    Logs 
};
    