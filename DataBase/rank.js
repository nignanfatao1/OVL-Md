const { Sequelize, DataTypes } = require('sequelize');
const config = require('../set');
const db = config.DATABASE;

const sequelize = new Sequelize(db, {
  dialect: 'postgres',
  ssl: true,
  protocol: 'postgres',
  dialectOptions: {
    native: true,
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: false,
});

const Ranks = sequelize.define('Ranks', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    exp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    messages: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'ranks',
    timestamps: false,
});

(async () => {
    await Ranks.sync();
    console.log("Table 'Ranks' synchronisée avec succès.");
})();
