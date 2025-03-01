const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.js"); 

const User = sequelize.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userPassword: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true 
    }
},
    {
        tableName: 'user',
        timeStamps: true
    }
);


module.exports = {
    User
}