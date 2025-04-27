const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Configura CORS para permitir solicitudes solo desde tu frontend en Vercel
const corsOptions = {
    origin: 'https://tiendaenlinea-mu.vercel.app', // Aquí colocas el dominio de tu frontend en Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos (ajústalo según lo que tu API necesite)
    allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos (ajústalo según lo que tu API necesite)
};

// Middleware
app.use(cors(corsOptions)); // Usa el middleware de CORS con las opciones especificadas
app.use(express.json());

// Importar rutas
const authRoutes = require("./auth");
const { router: dbRoutes } = require("./db");
const addProductosRoutes = require("./addproductos");
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

// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Importar rutas
// const authRoutes = require("./auth");
// const { router: dbRoutes } = require("./db");
// const addProductosRoutes = require("./addproductos");
// const slidesRoutes = require('./slides');
// app.use('/api', slidesRoutes);

// // Configurar para servir archivos estáticos desde la carpeta 'imagenes'
// app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
// app.use("/api", authRoutes); 
// app.use("/api", dbRoutes); 
// app.use("/api", addProductosRoutes); 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Iniciar el servidor (solo en index.js)
// app.listen(PORT, () => {
//     console.log(`Servidor backend corriendo en el puerto ${PORT}`);
// });
