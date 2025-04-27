const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const db = require("./database"); 
const router = express.Router();


// Configurar multer para guardar los archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'imagenes/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function(req, file, cb) {
        // Crear un nombre único para evitar sobrescrituras
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'producto-' + uniqueSuffix + extension);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar a 5MB
    fileFilter: function(req, file, cb) {
        // Aceptar solo ciertos tipos de imagen
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    }
});

// Ruta GET para obtener todos los productos o buscar por nombre
router.get("/productos", (req, res) => {
    // Verificar si hay un parámetro de búsqueda
    const searchTerm = req.query.search;
    let sql = "SELECT * FROM productos";
    let params = [];
    
    // Si hay término de búsqueda, modificar la consulta para filtrar por nombre
    if (searchTerm) {
        sql = "SELECT * FROM productos WHERE nombre LIKE ?";
        params = [`%${searchTerm}%`]; // Búsqueda parcial (contiene)
    }
    
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).json({ 
                error: "Error al recuperar productos", 
                details: err.message 
            });
        }
        
        // Mapear resultados para asegurar que las rutas de imagen sean completas
        const productosConImagenes = results.map(producto => ({
            ...producto,
            imagen: producto.imagen ? `imagenes/${path.basename(producto.imagen)}` : null
        }));
        
        res.status(200).json(productosConImagenes);
    });
});

// Ruta para obtener un producto específico por ID
router.get("/productos/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM productos WHERE id = ?";
    
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error("Error al obtener producto:", err);
            return res.status(500).json({ error: "Error al recuperar producto" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        const producto = results[0];
        res.status(200).json({
            ...producto,
            imagen: producto.imagen ? `imagenes/${path.basename(producto.imagen)}` : null
        });
    });
});

// Ruta para agregar un producto con carga de archivos
router.post("/productos", upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, stock } = req.body;
    
    // Obtener la ruta de la imagen si se subió
    const rutaImagen = req.file ? `imagenes/${req.file.filename}` : '';
    
    const sql = "INSERT INTO productos (nombre, descripcion, imagen, stock) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nombre, descripcion, rutaImagen, stock || 0], (err, result) => {
        if (err) {
            console.error("Error al insertar producto:", err);
            res.status(500).json({ error: "Error al agregar producto" });
        } else {
            res.status(201).json({ 
                message: "Producto agregado correctamente",
                producto: {
                    id: result.insertId,
                    nombre,
                    descripcion,
                    imagen: rutaImagen,
                    stock
                }
            });
        }
    });
});

// Ruta para actualizar un producto existente
router.put("/productos/:id", upload.single('imagen'), (req, res) => {
    const productId = req.params.id;
    const { nombre, descripcion, stock } = req.body;
    
    // Primero verificar si el producto existe
    db.query("SELECT * FROM productos WHERE id = ?", [productId], (err, results) => {
        if (err) {
            console.error("Error al buscar producto:", err);
            return res.status(500).json({ error: "Error al buscar producto" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        const productoExistente = results[0];
        
        // Determinar la ruta de la imagen a guardar
        let rutaImagen = productoExistente.imagen; // Mantener la imagen existente por defecto
        
        if (req.file) {
            // Si se subió una nueva imagen, actualizar la ruta
            rutaImagen = `imagenes/${req.file.filename}`;
        }
        
        // Actualizar el producto
        const sql = "UPDATE productos SET nombre = ?, descripcion = ?, imagen = ?, stock = ? WHERE id = ?";
        
        db.query(sql, [nombre, descripcion, rutaImagen, stock || 0, productId], (err, result) => {
            if (err) {
                console.error("Error al actualizar producto:", err);
                return res.status(500).json({ error: "Error al actualizar producto" });
            }
            
            res.status(200).json({
                message: "Producto actualizado correctamente",
                producto: {
                    id: productId,
                    nombre,
                    descripcion,
                    imagen: rutaImagen,
                    stock
                }
            });
        });
    });
});

// Ruta para eliminar un producto
router.delete("/productos/:id", (req, res) => {
    const productId = req.params.id;
    
    // Primero obtenemos el producto para saber si tiene imagen
    db.query("SELECT * FROM productos WHERE id = ?", [productId], (err, results) => {
        if (err) {
            console.error("Error al buscar producto:", err);
            return res.status(500).json({ error: "Error al buscar producto" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        
        // Eliminar el producto
        db.query("DELETE FROM productos WHERE id = ?", [productId], (err, result) => {
            if (err) {
                console.error("Error al eliminar producto:", err);
                return res.status(500).json({ error: "Error al eliminar producto" });
            }
            
            res.status(200).json({ message: "Producto eliminado correctamente" });
        });
    });
});

module.exports = router;