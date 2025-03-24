import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./login";
import Dashboard from "./itemstienda";
import RegistroUsuario from "./registeruser";

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
                <Route path="/" element={<Login />} />
                <Route path="/itemstienda" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/register" element={<RegistroUsuario />} />
            </Routes>
        </Router>
    );
}

export default App;
