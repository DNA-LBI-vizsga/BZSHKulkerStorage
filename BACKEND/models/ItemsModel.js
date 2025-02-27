const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js");

const {ItemName} = require("../models/ItemNameModel");
const {StoragePlace} = require("../models/StoragePlaceModel");
const {User} = require("../models/UserModel");
const {Value} = require("../models/ValueModel");

const Items = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    item_name_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    storage_place_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_code: {
        type:DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updated_by:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
    },  
    {
        tableName: 'items',
        timestamps: true
    }
);

module.exports = {  
    Items 
};
    