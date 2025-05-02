const { Client } = require("pg");
require('dotenv').config();

// Usa la URL de conexión de PostgreSQL desde el archivo .env
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Esto permite conexiones SSL sin verificar el certificado (útil en algunas plataformas)
  }
};

// Crear una nueva instancia de cliente para PostgreSQL
const client = new Client(dbConfig);

// Función asincrónica para conectar a la base de datos
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Conectado a PostgreSQL exitosamente");
    console.log(`Conectado a la base de datos: ${process.env.DATABASE_URL}`);
  } catch (err) {
    console.error("Error conectando a PostgreSQL:", err);
  }
};

// Llamar la función para conectarse a la base de datos
connectToDatabase();

// Exportar el cliente para su uso en otras partes de la aplicación
module.exports = client;
