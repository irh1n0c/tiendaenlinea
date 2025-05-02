const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");  // Importación de la conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Realizar una consulta de prueba a la base de datos
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("Error en la consulta:", err);
  } else {
    console.log("Consulta exitosa, hora actual:", res.rows[0].now);
  }
});

// Importar rutas
const authRoutes = require("./auth");
const registerRoutes = require("./registeruser");  // Cambiado para importar el router directamente
const addProductosRoutes = require("./addproductos");
const slidesRoutes = require('./slides');

// Configurar para servir archivos estáticos
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas
app.use('/api', slidesRoutes);
app.use("/api", authRoutes); 
app.use("/api", registerRoutes);  // Ahora usamos el router directamente
app.use("/api", addProductosRoutes); 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});