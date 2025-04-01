const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require("./auth");
const { router: dbRoutes } = require("./db");
const addProductosRoutes = require("./addproductos");
// En tu archivo principal (app.js o index.js)
const slidesRoutes = require('./slides');
app.use('/api', slidesRoutes);

// Configurar para servir archivos estáticos desde la carpeta 'imagenes'
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use("/api", authRoutes); 
app.use("/api", dbRoutes); 
app.use("/api", addProductosRoutes); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor (solo en index.js)
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
