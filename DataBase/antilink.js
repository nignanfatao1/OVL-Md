const { Sequelize, DataTypes } = require('sequelize');
const config = require('../set');
const db = config.DATABASE;

// Connexion à la base de données
const sequelize = new Sequelize(db, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Définir la table Antilink
const Antilink = sequelize.define(
  'Antilink',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    mode: {
      type: DataTypes.STRING,
      defaultValue: 'non', // Par défaut, mode désactivé
    },
    type: {
      type: DataTypes.ENUM('supp', 'warn', 'kick'),
      defaultValue: 'supp', // Action par défaut
    },
  },
  {
    tableName: 'antilink',
    timestamps: false,
  }
);

// Synchroniser la table
(async () => {
  await Antilink.sync();
  console.log("Table 'Antilink' synchronisée avec succès.");
})();

module.exports = { Antilink };
