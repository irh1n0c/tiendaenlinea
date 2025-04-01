import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./login";
import Dashboard from "./itemstienda";
import RegistroUsuario from "./registeruser";
import WebProductos from "./webproductos"; // Importa el nuevo componente

// Componente para proteger rutas privadas
function PrivateRoute({ element }) {
    const isAuthenticated = localStorage.getItem("auth") === "true";
    return isAuthenticated ? element : <Navigate to="/" />;
}

function App() {
    useEffect(() => {
        
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<WebProductos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/itemstienda" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/register" element={<RegistroUsuario />} />
                {/* <Route path="/productos" element={<WebProductos />} /> */}
            </Routes>
        </Router>
    );
}

export default App;