const mysql = require("mysql2");
const express = require("express");
const db = require("./database"); 
const router = express.Router();



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
