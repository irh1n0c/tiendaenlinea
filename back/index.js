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


// Configurar para servir archivos estáticos desde la carpeta 'imagenes'
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use("/api", authRoutes); 
app.use("/api", dbRoutes); 
app.use("/api", addProductosRoutes); 

// Iniciar el servidor (solo en index.js)
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
