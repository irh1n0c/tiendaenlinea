const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Directorio donde se guardarán las imágenes del slider
const SLIDER_DIR = 'uploads/slider';

// Asegurarse de que el directorio exista
if (!fs.existsSync(SLIDER_DIR)) {
    fs.mkdirSync(SLIDER_DIR, { recursive: true });
}

// Configuración para guardar las imágenes con nombres fijos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, SLIDER_DIR);
    },
    filename: function(req, file, cb) {
        const slideNumber = req.params.position;
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `slide${slideNumber}${extension}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    }
});

// Archivo JSON para almacenar información sobre los slides
const SLIDES_INFO_FILE = path.join(SLIDER_DIR, 'slides_info.json');

// Función para leer la información actual de los slides
function getSlidesInfo() {
    if (fs.existsSync(SLIDES_INFO_FILE)) {
        try {
            const data = fs.readFileSync(SLIDES_INFO_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer archivo de slides:", error);
        }
    }
    
    // Información por defecto si no existe el archivo
    return [
        { 
            id: 1, 
            titulo: 'Slide 1', 
            imagen: 'uploads/slider/slide1.jpg', 
            link: '' 
        },
        { 
            id: 2, 
            titulo: 'Slide 2', 
            imagen: 'uploads/slider/slide2.jpg', 
            link: '' 
        },
        { 
            id: 3, 
            titulo: 'Slide 3', 
            imagen: 'uploads/slider/slide3.jpg', 
            link: '' 
        }
    ];
}

// Función para guardar la información de los slides
function saveSlidesInfo(slides) {
    try {
        fs.writeFileSync(SLIDES_INFO_FILE, JSON.stringify(slides, null, 2));
    } catch (error) {
        console.error("Error al guardar archivo de slides:", error);
    }
}

// Ruta GET para obtener todos los slides
router.get("/slides", (req, res) => {
    const slides = getSlidesInfo();
    
    // Verificar si cada imagen existe realmente
    slides.forEach(slide => {
        const imagePath = slide.imagen.replace('uploads/slider/', '');
        const fullPath = path.join(SLIDER_DIR, imagePath);
        
        if (!fs.existsSync(fullPath)) {
            // Si no existe, usar una imagen placeholder
            slide.imagen = 'uploads/slider/placeholder.jpg';
        }
    });
    
    res.status(200).json(slides);
});

// Rutas existentes...

// Crear una imagen placeholder por defecto
const placeholderPath = path.join(SLIDER_DIR, 'placeholder.jpg');
if (!fs.existsSync(placeholderPath)) {
    try {
        // Crear una imagen placeholder básica
        const placeholderContent = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'
        );
        fs.writeFileSync(placeholderPath, placeholderContent);
        console.log("Imagen placeholder para slides creada correctamente");
    } catch (error) {
        console.error("Error al crear imagen placeholder:", error);
    }
}

module.exports = router;