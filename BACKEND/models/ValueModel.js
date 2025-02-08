const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js"); 
const Value = sequelize.define('Value', {
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'value',
    timestamps: false 
});



module.exports = { 
    Value 
};
