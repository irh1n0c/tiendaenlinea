const express = require("express");
const pool = require("./database"); // ahora usa pg
const router = express.Router();

router.post("/login", async (req, res) => {
    const { nombre, contrasena } = req.body;
    const sql = "SELECT * FROM usuarios WHERE nombre = $1 AND contrasena = $2";

    try {
        const result = await pool.query(sql, [nombre, contrasena]);

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: "Login exitoso" });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;
