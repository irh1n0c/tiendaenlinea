import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductSlider = () => {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get('http://localhost:3001/api/slides');
                const slidesData = Array.isArray(response.data) ? response.data : response.data.slides || [];
                
                setSlides(slidesData);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar el slider:', err);
                setError(err.response?.data?.message || 'Error al cargar las imágenes del slider');
                setLoading(false);
                
                setSlides([
                    { id: 1, imagen: 'slider/slide1.jpg', titulo: 'Promoción 1' },
                    { id: 2, imagen: 'slider/slide2.jpg', titulo: 'Nuevos Productos' },
                    { id: 3, imagen: 'slider/slide3.jpg', titulo: 'Ofertas Especiales' }
                ]);
            }
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && slides.length === 0) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                {error}
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative mb-8 overflow-hidden rounded-lg shadow-lg">
            <div className="relative h-64 md:h-80 lg:h-96 xl:h-[500px] w-full overflow-hidden">

                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <img 
                            src={`http://localhost:3001/${slide.imagen}`} 
                            alt={slide.titulo || `Slide ${index + 1}`} 
                            className="w-full h-full object-cover" 
                        />
                        {slide.titulo && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                                <h3 className="text-xl font-bold">{slide.titulo}</h3>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 z-20 rounded-r-lg hover:bg-opacity-75"
                aria-label="Anterior"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 z-20 rounded-l-lg hover:bg-opacity-75"
                aria-label="Siguiente"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 w-3 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                        aria-label={`Ir a diapositiva ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
