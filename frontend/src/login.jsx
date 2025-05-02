import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [nombre, setNombre] = useState("");
    const [contrasena, setcontrasena] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("auth") === "true") {
            navigate("/itemstienda"); 
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Usamos la URL de la API basada en el entorno
        const apiUrl = import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_API_URL
            : 'http://localhost:3001';  // URL de desarrollo

        try {
            const response = await axios.post(`${apiUrl}/api/login`, {
                nombre,
                contrasena,
            });

            if (response.data.success) {
                localStorage.setItem("auth", "true");
                navigate("/itemstienda");
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("Error en el servidor");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>

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
                    value={contrasena}
                    onChange={(e) => setcontrasena(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Iniciar Sesión
                </button>
                <p className="mt-4 text-center">
                    ¿No tienes una cuenta?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Regístrate aquí
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;
