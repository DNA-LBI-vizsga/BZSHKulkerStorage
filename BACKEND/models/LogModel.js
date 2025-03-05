import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js";



const Logs = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    itemNameId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    storagePlaceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    previousQuantity: {  
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantityChange:{
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '0'
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
    