import { useState } from "react";
import axios from "axios";

function RegistroUsuario() {
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [telefono, setTelefono] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        
        try {
            const response = await axios.post("http://localhost:3001/api/registrar", {
                nombre,
                contrasena,
                telefono,
            });
            
            setMensaje(response.data.message);
            setNombre("");
            setContrasena("");
            setTelefono("");
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            setError(error.response?.data?.error || "Error al conectar con el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
                
                {mensaje && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {mensaje}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Registrar
                </button>
            </form>
        </div>
    );
}

export default RegistroUsuario;