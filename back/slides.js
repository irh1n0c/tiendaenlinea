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

// Configuración para guardar las imágenes con nombres fijos (slide1.jpg, slide2.jpg, slide3.jpg)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, SLIDER_DIR);
    },
    filename: function(req, file, cb) {
        // Usar el número de slide como nombre de archivo (1, 2 o 3)
        const slideNumber = req.params.position;
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `slide${slideNumber}${extension}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limitar a 10MB
    fileFilter: function(req, file, cb) {
        // Aceptar solo ciertos tipos de imagen
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
            // Si no existe, usar una imagen por defecto o placeholder
            slide.imagen = 'uploads/slider/placeholder.jpg';
        }
    });
    
    res.status(200).json(slides);
});

// Ruta para actualizar un slide específico
router.put("/slides/:position", upload.single('imagen'), (req, res) => {
    const position = parseInt(req.params.position);
    const { titulo, link } = req.body;
    
    // Validar que la posición sea 1, 2 o 3
    if (position < 1 || position > 3) {
        return res.status(400).json({ error: "Posición de slide inválida. Debe ser 1, 2 o 3." });
    }
    
    // Obtener la información actual
    const slides = getSlidesInfo();
    
    // Actualizar la información del slide
    const slideIndex = position - 1;
    
    // Determinar la ruta de la imagen
    let imagePath = slides[slideIndex].imagen;
    
    if (req.file) {
        // Si se subió una nueva imagen
        const extension = path.extname(req.file.originalname).toLowerCase();
        imagePath = `uploads/slider/slide${position}${extension}`;
    }
    
    // Actualizar la información
    slides[slideIndex] = {
        id: position,
        titulo: titulo || slides[slideIndex].titulo,
        imagen: imagePath,
        link: link || slides[slideIndex].link
    };
    
    // Guardar los cambios
    saveSlidesInfo(slides);
    
    res.status(200).json({
        message: "Slide actualizado correctamente",
        slide: slides[slideIndex]
    });
});

// Ruta para obtener un slide específico
router.get("/slides/:position", (req, res) => {
    const position = parseInt(req.params.position);
    
    // Validar que la posición sea 1, 2 o 3
    if (position < 1 || position > 3) {
        return res.status(400).json({ error: "Posición de slide inválida. Debe ser 1, 2 o 3." });
    }
    
    const slides = getSlidesInfo();
    const slide = slides[position - 1];
    
    res.status(200).json(slide);
});

// Si no existe una imagen placeholder, crear una por defecto (opcional)
const placeholderPath = path.join(SLIDER_DIR, 'placeholder.jpg');
if (!fs.existsSync(placeholderPath)) {
    try {
        // Copiar una imagen placeholder desde algún lugar o crear una básica
        // Este paso es opcional y depende de tu implementación
        console.log("No existe imagen placeholder para slides");
    } catch (error) {
        console.error("Error al crear imagen placeholder:", error);
    }
}

module.exports = router;