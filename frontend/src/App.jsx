import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Categorias from './components/Categorias';
import Medicamentos from './components/Medicamentos';
import Empleados from './components/Empleados';
function App() {
  return (
    <Router>
      <nav style={{ padding: '15px', background: '#2c3e50', marginBottom: '20px' }}>
        <Link to="/categorias" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Categorías</Link>
        <Link to="/medicamentos" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Medicamentos</Link>
        <Link to="/empleados" style={{ color: '#fff', textDecoration: 'none' }}>Empleados</Link>
      </nav>

      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/medicamentos" element={<Medicamentos />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/" element={<Medicamentos />} /> {/* Ruta por defecto */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;