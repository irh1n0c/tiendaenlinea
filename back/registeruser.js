const express = require("express");
const db = require("./database");  // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para registrar usuario
router.post("/registrar", async (req, res) => {
    const { nombre, contrasena, telefono } = req.body;
    
    try {
        // En PostgreSQL usamos $1, $2, etc. en lugar de ? para parámetros
        const sql = "INSERT INTO usuarios (nombre, contrasena, telefono) VALUES ($1, $2, $3)";
        const result = await db.query(sql, [nombre, contrasena, telefono]);
        
        res.status(200).json({ message: "Usuario registrado exitosamente" });
    } catch (err) {
        console.error("Error en registro de usuario:", err);
        res.status(500).json({ error: err.message });
    }
});

// Exportamos solo el router
module.exports = router;