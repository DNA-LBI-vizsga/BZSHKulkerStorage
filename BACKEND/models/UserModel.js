import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from "../config.js"; 

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


export{
    User
}