"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const basename = path.basename(__filename);
const db = {};
const {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    DB_HOST,
    DB_HOST_PRODUCTION,
    DB_USER_PRODUCTION,
    DB_PORT_PRODUCTION,
    DB_PASSWORD_PRODUCTION,
    NODE_ENV,
    DB_HOST_DEVELOPMENT,
    DB_PASSWORD_DEVELOPMENT,
} = process.env;

let sequelize;



if (NODE_ENV === "production") {
    // production
    sequelize = new Sequelize(
        DB_NAME,
        DB_USER_PRODUCTION,
        DB_PASSWORD_PRODUCTION,
        {
            host: DB_HOST_PRODUCTION,
            dialect: DB_DIALECT,
            port: DB_PORT_PRODUCTION,
            timezone: "+05:30",
            pool: {
                max: 200,
                min: 0,
                idle: 10000,
                acquire: 30000,
            },
        }
    );
} else if (NODE_ENV === "development") {
    // development
    sequelize = new Sequelize(
        DB_NAME,
        DB_USER,
        DB_PASSWORD_DEVELOPMENT,
        {
            host: DB_HOST_DEVELOPMENT,
            dialect: DB_DIALECT,
            port: DB_PORT_PRODUCTION,
            timezone: "+05:30",
            pool: {
                max: 200,
                min: 0,
                idle: 10000,
                acquire: 30000,
            },
        }
    );
} else {
    // development
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        dialect: DB_DIALECT,
        host: DB_HOST,
        port: 3306,
        timezone: "+05:30",
        pool: {
            max: 200,
            min: 0,
            idle: 10000,
            acquire: 30000,
        },
    });
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

module.exports = db;
