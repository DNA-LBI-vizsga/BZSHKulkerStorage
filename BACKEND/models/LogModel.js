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
    itemId:{
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
    