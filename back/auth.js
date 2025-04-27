const express = require("express");
const mysql = require("mysql2");
const db = require("./database"); 
const router = express.Router();



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
