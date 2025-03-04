import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js"; 

const User = sequelize.define('User', {
    userEmail: {
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
    },
    isFirstLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
},
    {
        tableName: 'user',
        timeStamps: true
    }
);


export{
    User
}