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
        allowNull: false,
        references: {
            model: ItemName, 
            key: "id"    
        },

    },
    value_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Value, 
            key: "id"
        }
    },
    storage_place_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: StoragePlace, 
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: "id"
        }
    },
    product_code: {
        type:DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    descreption: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    