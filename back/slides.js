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
        { id: 1, titulo: 'Slide 1', imagen: 'uploads/slider/slide1.jpg', link: '' },
        { id: 2, titulo: 'Slide 2', imagen: 'uploads/slider/slide2.jpg', link: '' },
        { id: 3, titulo: 'Slide 3', imagen: 'uploads/slider/slide3.jpg', link: '' }
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
            slide.imagen = 'uploads/slider/placeholder.jpg';
        }
    });

    res.status(200).json(slides);
});

// Ruta PUT para actualizar un slide
router.put("/slides/:position", upload.single("imagen"), (req, res) => {
    const position = parseInt(req.params.position);

    if (![1, 2, 3].includes(position)) {
        return res.status(400).json({ error: "Posición inválida del slide." });
    }

    const slides = getSlidesInfo();
    const slideIndex = slides.findIndex(s => s.id === position);

    if (slideIndex === -1) {
        return res.status(404).json({ error: "Slide no encontrado." });
    }

    // Actualizar datos del slide
    if (req.body.titulo) {
        slides[slideIndex].titulo = req.body.titulo;
    }

    if (req.body.link !== undefined) {
        slides[slideIndex].link = req.body.link;
    }

    if (req.file) {
        const extension = path.extname(req.file.originalname).toLowerCase();
        slides[slideIndex].imagen = `${SLIDER_DIR}/slide${position}${extension}`;
    }

    saveSlidesInfo(slides);

    res.status(200).json({ message: "Slide actualizado correctamente", slide: slides[slideIndex] });
});

// Crear una imagen placeholder por defecto
const placeholderPath = path.join(SLIDER_DIR, 'placeholder.jpg');
if (!fs.existsSync(placeholderPath)) {
    try {
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
