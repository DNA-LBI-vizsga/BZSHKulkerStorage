require('dotenv').config(); 
const { Sequelize } = require('sequelize');

const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'mysql'
    }
};

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false
});

module.exports = {
    sequelize
};
