const express = require("express");
const mysql = require("mysql2");
require('dotenv').config();
const router = express.Router();

// Conectar a MySQL
// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});
db.connect(err => {
    if (err) {
        console.error("Error de conexión a MySQL:", err);
    } else {
        console.log("Conectado a MySQL (auth.js)");
    }
});

// Ruta de Login
router.post("/login", (req, res) => {
    const { nombre, contraseña } = req.body;
    const sql = "SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?";
    
    db.query(sql, [nombre, contraseña], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            res.status(200).json({ success: true, message: "Login exitoso" });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

module.exports = router;
