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
    actionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updatedBy:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
    },  
    {
        tableName: 'logs',
        timestamps: true,
        createdAt: false
    }
);

export{  
    Logs 
};
    