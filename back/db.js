const mysql = require("mysql2");
const express = require("express");

const router = express.Router();

// Conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "awds123", 
    database: "tienda"
});

db.connect(err => {
    if (err) {
        console.error("Error de conexión a MySQL:", err);
    } else {
        console.log("Conectado a MySQL (db.js)");
    }
});

// Ruta para registrar usuario
router.post("/registrar", (req, res) => {
    const { nombre, contraseña, telefono } = req.body;
    const sql = "INSERT INTO usuarios (nombre, contraseña, telefono) VALUES (?, ?, ?)";

    db.query(sql, [nombre, contraseña, telefono], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Usuario registrado exitosamente" });
    });
});

module.exports = { db, router };
