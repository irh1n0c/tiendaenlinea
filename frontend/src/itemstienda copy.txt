import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        imagen: "",
        stock: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    // Función handleSubmit actualizada para usar FormData
    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
                // No incluimos headers porque FormData establece automáticamente el content-type
                body: formData
            });
            
            if (response.ok) {
                alert("Producto agregado correctamente");
                setForm({ nombre: "", descripcion: "", imagen: "", stock: "" });
                setImagePreview(null); // Limpiar la vista previa
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Agregar Producto</h1>
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    Agregar Producto
                </button>
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