import { useState } from "react";
import axios from "axios";

function RegistroUsuario() {
    const [nombre, setNombre] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [telefono, setTelefono] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/api/registrar", {
                nombre,
                contraseña,
                telefono,
            });
            alert(response.data.message);
            setNombre("");
            setContraseña("");
            setTelefono("");
        } catch (error) {
            console.error("Error al registrar usuario:", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
                
                <label className="block">Nombre:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                <label className="block">Contraseña:</label>
                <input
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                <label className="block">Teléfono:</label>
                <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

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