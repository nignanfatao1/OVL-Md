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

const GlobalSettings = sequelize.define('GlobalSettings', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: 'global'
    },
    levelUpEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'global_settings',
    timestamps: false,
});

(async () => {
    await Ranks.sync();
    await GlobalSettings.sync();
    console.log("Tables 'Ranks' et 'LevelUp' synchronisées avec succès.");
})();


module.exports = { Ranks, GlobalSettings };
