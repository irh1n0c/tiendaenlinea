import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductSlider from './ProductSlider'; // Importa el nuevo componente


const WebProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Modificado para usar puerto 3001
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API_URL}/api/productos`);
                // const response = await axios.get('http://localhost:3001/api/productos');
                // const response = await axios.get('https://uniform-maker-dimensions-reduced.trycloudflare.com');
                
                console.log('Respuesta del backend:', response.data);

                const productosData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.productos || [];

                setProductos(productosData);
                setLoading(false);
            } catch (err) {
                console.error('Error detallado:', err);
                setError(err.response?.data?.message || err.message || 'Error al cargar los productos');
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const enviarWhatsApp = (producto) => {
        // Capturar información del producto
        const { nombre, descripcion, imagen } = producto;
        
        // Crear la URL de la imagen completa
        //const urlImagen = `http://192.168.1.16:5173/${imagen}`;
        
        // Crear el mensaje para WhatsApp
        const mensaje = `¡Hola! Me interesa el producto: *${nombre}* - Precio: *${descripcion}`;
        
        // Codificar el mensaje para URL
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Número de WhatsApp al que se enviará (reemplazar con el número correcto)
        const numeroWhatsApp = "+51903024070"; // Reemplazar con el número real
        
        // Crear la URL de WhatsApp con el mensaje
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp en una nueva ventana/pestaña
        window.open(urlWhatsApp, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {error}
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Aquí se incluye el slider en la parte superior */}
            <ProductSlider />
            
            <h1 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h1>
            {productos.length === 0 ? (
                <div className="text-center text-gray-500">
                    No hay productos disponibles
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
    {productos.map((producto) => (
        <div 
            key={producto.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col h-full"
        >
            <div className="w-full h-24 sm:h-36 md:h-48 lg:h-64 overflow-hidden">
                {producto.imagen ? (
                    <img 
                        src={`http://localhost:3001/${producto.imagen}`} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No imagen</span>
                    </div>
                )}
            </div>
            <div className="p-2 sm:p-3 md:p-4 w-full flex-1 flex flex-col">
                <div className="mb-1 sm:mb-2 h-8 sm:h-10 md:h-12 overflow-hidden">
                    <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold break-words">{producto.nombre}</h2>
                </div>
                <div className="flex-1 mb-1 sm:mb-3 md:mb-1 min-h-[10px] sm:min-h-[50px] md:min-h-[10px] overflow-y-auto">
                    <p className="text-[12px] sm:text-[10px] md:text-xs lg:text-sm text-gray-600 break-words">{producto.descripcion}</p>
                </div>
                <div className="mb-1 sm:mb-3 md:mb-4 h-1 sm:h-7 md:h-8 flex items-center">
                    <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-gray-700">
                        Stock: {producto.stock}
                    </span>
                </div>
                <div className="mt-auto">
                    <button 
                        className="bg-blue-500 text-white px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 text-[8px] sm:text-[10px] md:text-xs lg:text-sm rounded hover:bg-blue-600 transition duration-300 w-full"
                        onClick={() => enviarWhatsApp(producto)}
                    >
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    ))}
</div>
            )}
        </div>
    );
};

export default WebProductos;