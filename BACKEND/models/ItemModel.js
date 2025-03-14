import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js";



const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    itemNameId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    },  
    {
        tableName: 'ITEM',
        timestamps: false
    }
);

export{  
    Item
};
    