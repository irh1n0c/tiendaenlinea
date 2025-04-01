import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SliderAdmin = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        link: '',
        imagen: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Cargar los slides al iniciar
    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/api/slides');
            setSlides(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar slides:', err);
            setError('Error al cargar las imágenes del slider');
            setLoading(false);
        }
    };

    const handleSelectSlide = (slide) => {
        setCurrentSlide(slide);
        setFormData({
            titulo: slide.titulo || '',
            link: slide.link || '',
            imagen: null
        });
        setPreviewImage(`http://localhost:3001/${slide.imagen}`);
        setSuccessMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                imagen: file
            });
            
            // Crear vista previa de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentSlide) return;

        try {
            setLoading(true);
            
            // Crear FormData para enviar al servidor
            const data = new FormData();
            data.append('titulo', formData.titulo);
            data.append('link', formData.link);
            if (formData.imagen) {
                data.append('imagen', formData.imagen);
            }
            
            // Enviar al servidor
            const response = await axios.put(
                `http://localhost:3001/api/slides/${currentSlide.id}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            setSuccessMessage('¡Slide actualizado correctamente!');
            fetchSlides(); // Recargar los slides
            setLoading(false);
        } catch (err) {
            console.error('Error al actualizar slide:', err);
            setError('Error al actualizar el slide');
            setLoading(false);
        }
    };

    if (loading && slides.length === 0) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Administrar Slider</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {successMessage}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {slides.map(slide => (
                    <div 
                        key={slide.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer ${
                            currentSlide && currentSlide.id === slide.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleSelectSlide(slide)}
                    >
                        <div className="h-40 overflow-hidden">
                            <img 
                                src={`http://localhost:3001/${slide.imagen}`}
                                alt={slide.titulo || `Slide ${slide.id}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold">{slide.titulo || `Slide ${slide.id}`}</h3>
                            <p className="text-sm text-gray-500">
                                {slide.link ? (
                                    <a href={slide.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {slide.link}
                                    </a>
                                ) : (
                                    "Sin enlace"
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {currentSlide && (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Editar Slide {currentSlide.id}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Enlace (opcional)
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                placeholder="https://ejemplo.com/pagina"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Imagen
                            </label>
                            <input
                                type="file"
                                name="imagen"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        
                        {previewImage && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Vista previa
                                </label>
                                <div className="h-40 w-full overflow-hidden rounded">
                                    <img 
                                        src={previewImage} 
                                        alt="Vista previa" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SliderAdmin;