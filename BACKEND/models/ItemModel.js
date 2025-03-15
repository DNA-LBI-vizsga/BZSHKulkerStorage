import { sequelize } from "../config.js";
import pkg from 'sequelize';
const { DataTypes } = pkg;



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
    