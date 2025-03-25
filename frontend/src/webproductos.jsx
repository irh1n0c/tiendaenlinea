import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Modificado para usar puerto 3001
                const response = await axios.get('http://localhost:3001/api/productos');
                
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
            <h1 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h1>
            {productos.length === 0 ? (
                <div className="text-center text-gray-500">
                    No hay productos disponibles
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <div 
                            key={producto.id} 
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                        >
                            {producto.imagen && (
                                <img 
                                    src={`http://localhost:3001/${producto.imagen}`} 
                                    alt={producto.nombre} 
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-bold">
                                        Stock: {producto.stock}
                                    </span>
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
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