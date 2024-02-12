const { Pool } = require("pg");

var dbUrl = "postgres://fatao:Kuz6KQRpz3S1swoTQTv1WOG8SPfSCppB@dpg-cmnlnkol5elc738lrj2g-a.oregon-postgres.render.com/cy";
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

async function createNbaFicheTable() {
  const client = await pool.connect();

  try {
    // Créez la table nbafiche si elle n'existe pas déjà
    await client.query(`
      CREATE TABLE IF NOT EXISTS nbafiche(
        id SERIAL PRIMARY KEY,
        e1 TEXT DEFAULT 'aucun',
        e2 TEXT DEFAULT 'aucun',
        e3 INTEGER DEFAULT 0,
        e4 INTEGER DEFAULT 0,
        e5 TEXT DEFAULT 'aucun',
        e6 TEXT DEFAULT 'aucun',
        e7 INTEGER DEFAULT 0,
        e8 INTEGER DEFAULT 0,
        e9 TEXT DEFAULT 'aucun',
        e10 TEXT DEFAULT 'aucun',
        e11 INTEGER DEFAULT 0,
        e12 INTEGER DEFAULT 0,
        e13 TEXT DEFAULT 'aucun',
        e14 TEXT DEFAULT 'aucun',
        e15 INTEGER DEFAULT 0,
        e16 INTEGER DEFAULT 0,
        e17 TEXT DEFAULT 'aucun',
        e18 TEXT DEFAULT 'aucun',
        e19 INTEGER DEFAULT 0,
        e20 INTEGER DEFAULT 0,
        e21 TEXT DEFAULT 'aucun',
        e22 TEXT DEFAULT 'aucun',
        e23 INTEGER DEFAULT 0,
        e24 INTEGER DEFAULT 0
        );
    `);
    console.log('Table nbafiche créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table nbafiche:', error);
  } finally {
    client.release();
  }
}

/*async function insertData1() {
  const client = await pool.connect();

  try {
    // Modifiez la définition de la table pour ajouter les colonnes
    await client.query(`
      ALTER TABLE nbafiche
     `);

    console.log('Colonnes ajoutées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des colonnes:', error);
  } finally {
    client.release();
  }
}*/
// Fonction pour insérer des données
async function insertData() {
  const client = await pool.connect();
  try {
    for (let i = 1; i <= 12; i++) {
      const query = `
        INSERT INTO nbafiche(e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16, e17, e18, e19, e20, e21, e22, e23, e24)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      `;

      const values = [
        'aucun', 'aucun', 0, 0, 'aucun', 'aucun', 0, 0, 'aucun', 'aucun', 0, 0, 'aucun', 'aucun', 0, 0, 'aucun', 'aucun', 0, 0, 'aucun', 'aucun', 0, 0,
      ];

      await client.query(query, values);
      console.log(`Données insérées avec succès pour l'ID ${i}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'insertion des données:", error);
  } finally {
    client.release();
  }
}
// Fonction pour récupérer toutes les données
async function getData(ide) {
  const client = await pool.connect();

  try {
   const query = 'SELECT e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16, e17, e18, e19, e20, e21, e22, e23, e24 FROM nbafiche WHERE id = $1';
    const result = await client.query(query, [ide]);

    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  } finally {
    client.release();
  }
}


// Appeler la fonction createNorth1FicheTable après la création de la table
createNbaFicheTable();
insertData();

module.exports = {
  createNbaFicheTable,
 // insertData1,
 // insertData,
  getData
};
