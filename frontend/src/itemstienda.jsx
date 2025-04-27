import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SliderAdmin from "./SliderAdmin";

function Dashboard() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        imagen: "",
        stock: ""
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        // Limpiar resultados de búsqueda cuando se cancela la búsqueda
        if (!isSearching) {
            setSearchResults([]);
        }
    }, [isSearching]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función handleFileChange modificada para incluir la vista previa
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                imagenFile: file,
                imagen: file.name 
            });
            
            // Crear URL para la vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para buscar productos
    const searchProducts = async () => {
        if (!searchTerm.trim()) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/productos?search=${encodeURIComponent(searchTerm)}`);
            
            if (response.ok) {
                const data = await response.json();
                const productos = Array.isArray(data) ? data : data.productos || [];
                setSearchResults(productos);
                setIsSearching(true);
            } else {
                alert("Error al buscar productos");
            }
        } catch (error) {
            console.error("Error en la búsqueda", error);
        }
    };

    // Función para seleccionar un producto para editar
    const selectProductToEdit = (producto) => {
        setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            stock: producto.stock,
            imagen: producto.imagen
        });
        setEditingId(producto.id);
        setIsEditing(true);
        
        // Si hay una imagen, mostrar vista previa
        if (producto.imagen) {
            setImagePreview(`http://localhost:3001/${producto.imagen}`);
        } else {
            setImagePreview(null);
        }
        
        // Cerrar el panel de búsqueda
        setIsSearching(false);
    };

    // Función para actualizar un producto
    const updateProduct = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('descripcion', form.descripcion);
        formData.append('stock', form.stock);
        
        if (form.imagenFile) {
            formData.append('imagen', form.imagenFile);
        }
        
        try {
            const response = await fetch(`http://localhost:3001/api/productos/${editingId}`, {
                method: "PUT",
                body: formData
            });
            
            if (response.ok) {
                alert("Producto actualizado correctamente");
                resetForm();
            } else {
                alert("Error al actualizar producto");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    };

    // Función para cancelar la edición
    const cancelEdit = () => {
        resetForm();
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setForm({ nombre: "", descripcion: "", imagen: "", stock: "" });
        setImagePreview(null);
        setIsEditing(false);
        setEditingId(null);
    };

    // Función handleSubmit actualizada para usar FormData
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isEditing) {
            await updateProduct(e);
            return;
        }
        
        // Crear un objeto FormData para enviar el archivo
        const formData = new FormData();
        formData.append('nombre', form.nombre);
        formData.append('descripcion', form.descripcion);
        formData.append('stock', form.stock);
        
        // Añadir el archivo si existe
        if (form.imagenFile) {
            formData.append('imagen', form.imagenFile);
        }
        
        try {
            const response = await fetch("http://localhost:3001/api/productos", {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                alert("Producto agregado correctamente");
                resetForm();
            } else {
                alert("Error al agregar producto");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    };

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem("auth"); // Elimina la autenticación
        navigate("/", { replace: true }); // Redirige al login
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
            {/* Barra de búsqueda */}
            <div className="w-full max-w-4xl mb-8 bg-white p-4 rounded-lg shadow-md">
                <SliderAdmin />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar producto por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="flex-grow border p-2 rounded"
                    />
                    <button
                        onClick={searchProducts}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Buscar
                    </button>
                </div>
                
                {/* Resultados de búsqueda */}
                {isSearching && searchResults.length > 0 && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-left">Stock</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map(producto => (
                                    <tr key={producto.id} className="border-t">
                                        <td className="px-4 py-2">{producto.nombre}</td>
                                        <td className="px-4 py-2">{producto.stock}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => selectProductToEdit(producto)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {isSearching && searchResults.length === 0 && (
                    <div className="mt-4 text-center text-gray-500 p-4 border rounded bg-gray-50">
                        No se encontraron productos con ese nombre
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold mb-4">
                {isEditing ? "Editar Producto" : "Agregar Producto"}
            </h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <label className="block mb-2">
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Descripción:
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1"
                    ></textarea>
                </label>
                <label className="flex flex-col items-start gap-2 border p-4 rounded-lg shadow-sm bg-white w-full mb-4">
                    <span className="text-gray-700 font-medium">Imagen:</span>
                    <input
                        type="file"
                        name="imagen"
                        id="imagen"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <label 
                        htmlFor="imagen" 
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Seleccionar archivo
                    </label>
                    {form.imagen && <div className="text-gray-600 mt-1 text-sm">{form.imagen}</div>}
                    
                    {/* Vista previa de la imagen */}
                    {imagePreview && (
                        <div className="mt-2 w-full">
                            <img 
                                src={imagePreview} 
                                alt="Vista previa" 
                                className="max-h-40 rounded-md shadow-sm object-contain" 
                            />
                        </div>
                    )}
                </label>

                <label className="block mb-4">
                    Stock:
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1"
                        min="0"
                    />
                </label>
                
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`text-white px-4 py-2 rounded w-full ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isEditing ? "Actualizar Producto" : "Agregar Producto"}
                    </button>
                    
                    {isEditing && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Dashboard;